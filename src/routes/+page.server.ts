import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const recentListings = await db.query.listings.findMany({
		where: eq(listings.isActive, true),
		orderBy: [desc(listings.createdAt)],
		limit: 12
	});

	return { recentListings };
};

export const actions: Actions = {
	logout: async ({ locals, cookies }) => {
		if (!locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		return redirect(302, '/login');
	}
};
