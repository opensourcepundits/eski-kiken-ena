import { db } from '$lib/server/db';
import { bookings, listings, ratings } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { desc, eq, and, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const userListings = await db.query.listings.findMany({
		where: eq(listings.ownerId, locals.user.id),
		orderBy: [desc(listings.createdAt)]
	});

	const userBookings = await db.query.bookings.findMany({
		where: eq(bookings.renterId, locals.user.id),
		with: {
			listing: true
		},
		orderBy: [desc(bookings.createdAt)]
	});

	// Also fetch bookings for the user's listings (as an owner)
	const userId = locals.user.id;
	const ownerBookings = await db.query.bookings.findMany({
		where: (table, { inArray }) =>
			inArray(
				table.listingId,
				db.select({ id: listings.id }).from(listings).where(eq(listings.ownerId, userId))
			),
		with: {
			listing: true,
			renter: true
		},
		orderBy: [desc(bookings.createdAt)]
	});

	return {
		userListings,
		userBookings,
		ownerBookings
	};
};

export const actions: Actions = {
	deleteListing: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { message: 'ID is required' });
		}

		// Ensure ownership
		const listing = await db.query.listings.findFirst({
			where: and(eq(listings.id, id), eq(listings.ownerId, locals.user.id))
		});

		if (!listing) {
			return fail(403, { message: 'Forbidden' });
		}

		try {
			await db.delete(listings).where(eq(listings.id, id));
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Failed to delete listing' });
		}

		return { success: true };
	},
	updateBookingStatus: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const bookingId = formData.get('bookingId') as string;
		const status = formData.get('status') as any;

		if (!bookingId || !status) {
			return fail(400, { message: 'Missing data' });
		}

		// Verify the user owns the listing for this booking
		const booking = await db.query.bookings.findFirst({
			where: eq(bookings.id, bookingId),
			with: {
				listing: true
			}
		});

		if (!booking || booking.listing.ownerId !== locals.user.id) {
			return fail(403, { message: 'Forbidden' });
		}

		try {
			console.log(`Updating booking ${bookingId} to ${status}`);
			await db.update(bookings).set({ status }).where(eq(bookings.id, bookingId));
			// If a booking is confirmed, increment the listing's count
			if (status === 'CONFIRMED') {
				const listingIdForCount = booking.listingId;
				await db
					.update(listings)
					.set({ count: sql`${listings.count} + 1` })
					.where(eq(listings.id, listingIdForCount));
			}
			console.log('Update successful');
		} catch (e) {
			console.error('Update failed:', e);
			return fail(500, { message: 'Failed to update status' });
		}

	},
	submitReview: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const listingId = formData.get('listingId') as string;
		const bookingId = formData.get('bookingId') as string;
		const ratingVal = parseInt(formData.get('rating') as string);
		const comment = formData.get('comment') as string;

		if (!listingId || !ratingVal) {
			return fail(400, { message: 'Missing data' });
		}

		// Verify booking validity for this user
		const booking = await db.query.bookings.findFirst({
			where: and(
				eq(bookings.id, bookingId),
				eq(bookings.renterId, locals.user.id),
				eq(bookings.listingId, listingId)
			)
		});

		if (!booking) {
			return fail(403, { message: 'Invalid booking' });
		}

		try {
			await db.insert(ratings).values({
				listingId,
				renterId: locals.user.id,
				rating: ratingVal,
				comment
			});

			// Recalculate listing rating stats
			const stats = await db
				.select({
					count: sql<number>`count(*)`,
					avg: sql<string>`avg(${ratings.rating})`
				})
				.from(ratings)
				.where(eq(ratings.listingId, listingId));

			const reviewCount = Number(stats[0]?.count) || 0;
			const avgRating = Number(stats[0]?.avg) || 0;

			await db
				.update(listings)
				.set({
					reviewCount,
					rating: avgRating.toString()
				})
				.where(eq(listings.id, listingId));
		} catch (e) {
			console.error('Review submission failed:', e);
			return fail(500, { message: 'Failed to submit review' });
		}

		return { success: true };
	}
};
