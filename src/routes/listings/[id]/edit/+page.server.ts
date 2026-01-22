import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const listing = await db.query.listings.findFirst({
		where: and(eq(listings.id, params.id), eq(listings.ownerId, locals.user.id))
	});

	if (!listing) {
		throw error(404, 'Listing not found');
	}

	return { listing };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const pricePerDay = formData.get('pricePerDay') as string;
		const district = formData.get('district') as any;
		const category = formData.get('category') as any;

		if (!title || !description || !pricePerDay || !district || !category) {
			return fail(400, { message: 'Missing required fields' });
		}

		try {
			await db
				.update(listings)
				.set({
					title,
					description,
					pricePerDay,
					district,
					category,
					updatedAt: new Date()
				})
				.where(and(eq(listings.id, params.id), eq(listings.ownerId, locals.user.id)));
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Failed to update listing' });
		}

		throw redirect(302, '/profile');
	}
};
