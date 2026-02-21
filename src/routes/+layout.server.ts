import type { LayoutServerLoad } from './$types';
import { checkExpiredBookings } from '$lib/server/workers/expiry';
import { db } from '$lib/server/db';
import { bookings, listings } from '$lib/server/db/schema';
import { eq, and, inArray, desc } from 'drizzle-orm';
export const load: LayoutServerLoad = async ({ locals }) => {
	// Lightweight background check (in a real app, use a proper cron/worker)
	if (Math.random() < 0.1) { // 10% chance to run on page load to avoid spamming db
		// We don't await this so it doesn't block the page load
		checkExpiredBookings().catch(err => console.error('Background expiry check failed', err));
	}

	let notifications: any[] = [];

	if (locals.user) {
		const userId = locals.user.id;
		const ownerListings = await db.select({ id: listings.id }).from(listings).where(eq(listings.ownerId, userId));
		const listingIds = ownerListings.map((l: any) => l.id);

		let pendingRequests: any[] = [];
		if (listingIds.length > 0) {
			pendingRequests = await db.query.bookings.findMany({
				where: and(
					inArray(bookings.listingId, listingIds),
					eq(bookings.status, 'PENDING')
				),
				with: {
					listing: true,
					renter: true
				},
				orderBy: [desc(bookings.createdAt)]
			});
		}

		const recentRenterUpdates = await db.query.bookings.findMany({
			where: and(
				eq(bookings.renterId, userId),
				inArray(bookings.status, ['CONFIRMED', 'CANCELLED'])
			),
			with: {
				listing: true
			},
			orderBy: [desc(bookings.createdAt)],
			limit: 5
		});

		notifications = [
			...pendingRequests.map(b => ({
				id: b.id,
				type: 'REQUEST_RECEIVED',
				message: `${b.renter?.firstName} requested to rent ${b.listing?.title}`,
				date: b.createdAt,
				href: '/profile'
			})),
			...recentRenterUpdates.map(b => ({
				id: b.id,
				type: b.status === 'CONFIRMED' ? 'REQUEST_ACCEPTED' : 'REQUEST_DECLINED',
				message: `Your request for ${b.listing?.title} was ${b.status?.toLowerCase()}`,
				date: b.createdAt,
				href: '/profile'
			}))
		].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
	}

	return {
		user: locals.user,
		notifications
	};
};
