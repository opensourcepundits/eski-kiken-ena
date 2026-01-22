import { db } from '$lib/server/db';
import { bookings, listings } from '$lib/server/db/schema';
import { error, redirect, fail } from '@sveltejs/kit';
import { desc, eq, and, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const listing = await db.query.listings.findFirst({
		where: and(eq(listings.id, params.id), eq(listings.ownerId, locals.user.id))
	});

	if (!listing) {
		throw error(404, 'Listing not found or you do not have permission to view its history.');
	}

	const listingBookings = await db.query.bookings.findMany({
		where: eq(bookings.listingId, params.id),
		with: {
			renter: true
		},
		orderBy: [desc(bookings.startDate)]
	});

	return {
		listing,
		listingBookings
	};
};

export const actions: Actions = {
	updateBookingStatus: async ({ request, locals, params }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const bookingId = formData.get('bookingId') as string;
		const status = formData.get('status') as any;

		if (!bookingId || !status) {
			return fail(400, { message: 'Missing data' });
		}

		// Verify the listing belongs to the user
		const listing = await db.query.listings.findFirst({
			where: and(eq(listings.id, params.id), eq(listings.ownerId, locals.user.id))
		});

		if (!listing) {
			return fail(403, { message: 'Unauthorized access to this listing' });
		}

		try {
			await db
				.update(bookings)
				.set({ status })
				.where(and(eq(bookings.id, bookingId), eq(bookings.listingId, params.id)));
			
			// If a booking is confirmed, increment the listing's count
			if (status === 'CONFIRMED') {
				await db
					.update(listings)
					.set({ count: sql`${listings.count} + 1` })
					.where(eq(listings.id, params.id));
			}
		} catch (e) {
			console.error('Database update failed:', e);
			return fail(500, { message: 'Failed to update status' });
		}

		// Redirecting back to the same page forces a fresh load of data
		throw redirect(303, `/profile/inventory/${params.id}`);
	}
};
