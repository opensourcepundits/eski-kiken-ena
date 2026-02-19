import { db } from '$lib/server/db';
import { kyc } from '$lib/server/db/kyc.schema';
import { uploadsDir } from '$lib/config/uploads';
import { fail, json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs from 'fs';

// Simple memory-less uploader: saves uploaded file to local uploads/kyc/
async function saveFile(file: File) {
	const uploadsPath = uploadsDir();
	if (!fs.existsSync(uploadsPath)) {
		fs.mkdirSync(uploadsPath, { recursive: true });
	}
	const ext = path.extname(file.name) || '.dat';
	const name = uuid() + ext;
	const fullPath = path.join(uploadsPath, name);
	const buf = Buffer.from(await file.arrayBuffer());
	fs.writeFileSync(fullPath, buf);
	// Return relative path for storage in DB
	return fullPath;
}

export const POST = async ({ request }) => {
	// parse multipart/form-data
	const form = await request.formData();
	const name = form.get('name')?.toString();
	const surname = form.get('surname')?.toString();
	const idType = form.get('id_type')?.toString();
	const identifierNumber = form.get('identifier_number')?.toString();
	const nationality = form.get('nationality')?.toString();
	const file = form.get('document') as File | null;

	// basic validation
	if (!name || !surname || !idType || !identifierNumber || !nationality || !file) {
		return fail(400, { message: 'All fields are required' });
	}
	if (!['NIC', 'Passport'].includes(idType)) {
		return fail(400, { message: 'Invalid id_type' });
	}

	// 1:1 constraint: check if user_id exists in KYC
	// Without auth, we cannot know user id; simulate by using a placeholder? We'll skip user check here and enforce via a per-request id in form
	const userId = form.get('user_id')?.toString();
	if (!userId) {
		// If no user_id provided, create without conflict check; but to satisfy 1:1, require user_id
		return fail(400, { message: 'user_id is required' });
	}

	const existing = await db
		.query(kyc)
		.findFirst({ where: (kyc) => require('drizzle-orm').eq(kyc.user_id, userId) });
	if (existing) {
		return fail(409, { message: 'KYC already exists for this user' });
	}

	const docPath = await saveFile(file as any);
	const newKyc = await db
		.insert(kyc)
		.values({
			id: uuid(),
			name,
			surname,
			id_type: idType,
			identifier_number: identifierNumber,
			nationality,
			document_url: docPath,
			user_id: userId,
			createdAt: new Date()
		})
		.executeTakeFirst();

	return json({ id: newKyc?.insertId ?? '' }, { status: 201 });
};
