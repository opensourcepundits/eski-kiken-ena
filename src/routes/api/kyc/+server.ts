import { db } from '$lib/server/db';
import { kyc } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';
import { put } from '@vercel/blob';

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
		return json({ message: 'All fields are required' }, { status: 400 });
	}
	// Note: main schema uses NIC and PASSPORT (all caps)
	const idTypeFormatted = idType.toUpperCase();
	if (!['NIC', 'PASSPORT'].includes(idTypeFormatted)) {
		return json({ message: 'Invalid id_type. Use NIC or PASSPORT' }, { status: 400 });
	}

	const userId = form.get('user_id')?.toString();
	if (!userId) {
		return json({ message: 'user_id is required' }, { status: 400 });
	}

	// 1:1 constraint: check if user_id exists in KYC
	const existing = await db
		.query.kyc.findFirst({ where: (kyc, { eq }) => eq(kyc.userId, userId) });

	if (existing) {
		return json({ message: 'KYC already exists for this user' }, { status: 409 });
	}

	try {
		// Upload to Vercel Blob
		const blob = await put(`kyc/${uuid()}-${file.name}`, file, {
			access: 'public',
			contentType: file.type
		});

		const newKyc = await db
			.insert(kyc)
			.values({
				id: uuid(),
				name,
				surname,
				idType: idTypeFormatted as any,
				identifierNumber: identifierNumber,
				nationality,
				documentImage: blob.url,
				userId: userId,
				createdAt: new Date()
			})
			.returning();

		return json({ id: newKyc[0]?.id ?? '' }, { status: 201 });
	} catch (err) {
		console.error('Error saving KYC to Vercel Blob:', err);
		return json({ message: 'Error uploading document' }, { status: 500 });
	}
};
