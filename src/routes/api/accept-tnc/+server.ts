import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ locals, request }) {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const fullName = `${locals.user.firstName} ${locals.user.lastName}`;

    if (data.signature.trim().toLowerCase() !== fullName.trim().toLowerCase()) {
        return json({ error: 'Invalid signature' }, { status: 400 });
    }

    await db.update(users).set({ tnc: true }).where(eq(users.id, locals.user.id));

    return json({ success: true });
}
