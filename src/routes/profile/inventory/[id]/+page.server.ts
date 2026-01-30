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

			// Fetch all confirmed/completed bookings for stats
			const validBookings = await db.query.bookings.findMany({
				where: and(
					eq(bookings.listingId, params.id),
					sql`${bookings.status} IN ('CONFIRMED', 'COMPLETED', 'ACTIVE', 'PAID')`
				)
			});

			let totalEarnings = 0;
			let totalDays = 0;
			const count = validBookings.length;

			for (const b of validBookings) {
				totalEarnings += Number(b.totalPrice);
				const start = new Date(b.startDate);
				const end = new Date(b.endDate);
				const diff = end.getTime() - start.getTime();
				const days = Math.ceil(diff / (1000 * 3600 * 24));
				totalDays += days;
			}

			const avgEarnings = count > 0 ? totalEarnings / count : 0;
			const avgDays = count > 0 ? totalDays / count : 0;

			await db
				.update(listings)
				.set({
					count,
					totalEarnings: totalEarnings.toFixed(2),
					avgEarnings: avgEarnings.toFixed(2),
					avgDays: avgDays.toFixed(1)
				})
				.where(eq(listings.id, params.id));
		} catch (e) {
			console.error('Database update failed:', e);
			return fail(500, { message: 'Failed to update status' });
		}

		// Redirecting back to the same page forces a fresh load of data
		throw redirect(303, `/profile/inventory/${params.id}`);
	}
};
