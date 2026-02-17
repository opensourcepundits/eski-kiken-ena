import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { listings, bookings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { sendLoanRequestEmail } from '$lib/server/email';

export const load: PageServerLoad = async ({ params }) => {
	const listing = await db.query.listings.findFirst({
		where: eq(listings.id, params.id),
		with: {
			owner: true,
			bookings: {
				where: (bookings, { ne }) => ne(bookings.status, 'CANCELLED')
			}
		}
	});

	// Build blocked ranges from CONFIRMED bookings for the calendar widget
	const blockedRanges = (listing?.bookings ?? [])
		.filter((b: any) => b.status === 'CONFIRMED')
		.map((b: any) => {
			const s = new Date(b.startDate).toISOString().slice(0, 10);
			const e = new Date(b.endDate).toISOString().slice(0, 10);
			return { start: s, end: e };
		});

	if (!listing) {
		throw error(404, 'Listing not found');
	}

	return {
		listing,
		blockedRanges
	};
};

export const actions: Actions = {
	book: async ({ params, request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Verify out identity avan fer enn booking' });
		}

		const formData = await request.formData();
		const startDate = formData.get('startDate') as string;
		const endDate = formData.get('endDate') as string;
		const renterMessage = formData.get('renterMessage') as string;

		if (!startDate || !endDate) {
			return fail(400, { message: 'Svp swazir ban date' });
		}

		const start = new Date(startDate);
		const end = new Date(endDate);

		if (end <= start) {
			return fail(400, { message: 'Date la pa bon' });
		}

		const listing = await db.query.listings.findFirst({
			where: eq(listings.id, params.id),
			with: {
				owner: true
			}
		});

		if (!listing) {
			return error(404, 'Listing missing');
		}

		// Validate operating hours
		// Validate operating hours logic removed as times are no longer collected here.
		// The owner will set times upon approval.

		// Calculate total price: (Price per day * days) + Deposit
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const rentalCost = Number(listing.pricePerDay) * diffDays;
		const deposit = Number(listing.deposit || 0);
		const totalPrice = (rentalCost + deposit).toFixed(2);

		try {
			// Check for date conflicts with existing CONFIRMED bookings for THIS listing only
			const existing = await db.query.bookings.findMany({
				where: (b, { eq, and }) => and(eq(b.listingId, params.id), eq(b.status, 'CONFIRMED'))
			});
			const hasConflict = existing?.some((b: any) => {
				const s = new Date(b.startDate);
				const e = new Date(b.endDate);
				return start <= e && end >= s;
			});
			if (hasConflict) {
				return fail(400, {
					message:
						'Selected dates are unavailable due to an existing confirmed booking for this listing'
				});
			}

			await db.insert(bookings).values({
				listingId: params.id,
				renterId: locals.user.id,
				startDate: start,
				endDate: end,
				totalPrice: totalPrice,
				status: 'PENDING',
				renterMessage: renterMessage || null,
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
			});

			await sendLoanRequestEmail({
				ownerEmail: listing.owner.email,
				ownerName: listing.owner.firstName,
				renterName: locals.user.firstName,
				listingTitle: listing.title,
				bookingDetails: {
					startDate: start,
					endDate: end,
					totalPrice,
					renterMessage
				}
			});
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Enn erreur finn arive, svp reessaye plizir' });
		}

		throw redirect(303, '/profile');
	}
};
