import { db } from '$lib/server/db';
import { bookings, listings, ratings } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { desc, eq, and, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import {
	sendLoanStatusChangedEmail,
	sendLoanCancelledByRenterEmail,
	sendAmendmentRequestedEmail,
	sendBookingUpdatedByRenterEmail
} from '$lib/server/email';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const userListings = await db.query.listings.findMany({
		where: eq(listings.ownerId, locals.user.id),
		with: {
			bookings: true
		},
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
		const ownerMessage = formData.get('message') as string;
		const pickupTime = formData.get('pickupTime') as string;
		const returnTime = formData.get('returnTime') as string;

		if (!bookingId || !status) {
			return fail(400, { message: 'Missing data' });
		}

		// Verify the user owns the listing for this booking OR is the renter
		const booking = await db.query.bookings.findFirst({
			where: eq(bookings.id, bookingId),
			with: {
				listing: {
					with: {
						owner: true
					}
				},
				renter: true
			}
		});

		if (!booking) {
			return fail(404, { message: 'Booking not found' });
		}

		const isOwner = booking.listing.ownerId === locals.user.id;
		const isRenter = booking.renterId === locals.user.id;

		if (!isOwner && !isRenter) {
			return fail(403, { message: 'Forbidden' });
		}

		// Renter can only CANCEL (unless they are also the owner testing their own item)
		if (isRenter && !isOwner && status !== 'CANCELLED') {
			return fail(403, { message: 'Renters can only cancel bookings' });
		}

		try {
			console.log(`Updating booking ${bookingId} to ${status} (User is Owner: ${isOwner}, Renter: ${isRenter})`);

			const updateData: any = { status };
			if (isOwner && status === 'CONFIRMED') {
				if (pickupTime) updateData.pickupTime = pickupTime;
				if (returnTime) updateData.returnTime = returnTime;
			}

			await db.update(bookings).set(updateData).where(eq(bookings.id, bookingId));

			// EMAIL NOTIFICATIONS
			if (isOwner) {
				// Owner updated status (CONFIRMED or CANCELLED/DECLINED)
				if (status === 'CONFIRMED' || status === 'CANCELLED') {
					await sendLoanStatusChangedEmail({
						renterEmail: booking.renter.email,
						renterName: booking.renter.firstName,
						listingTitle: booking.listing.title,
						status,
						ownerMessage,
						pickupTime,
						returnTime
					});
				}
			} else if (isRenter && status === 'CANCELLED') {
				// Renter cancelled
				await sendLoanCancelledByRenterEmail({
					ownerEmail: booking.listing.owner.email,
					ownerName: booking.listing.owner.firstName,
					renterName: booking.renter.firstName,
					listingTitle: booking.listing.title
				});
			}

			// If a booking is confirmed, increment the listing's count
			if (status === 'CONFIRMED' || status === 'CANCELLED') {
				const listingIdForCount = booking.listingId;

				// Fetch all confirmed/completed bookings for stats
				const validBookings = await db.query.bookings.findMany({
					where: and(
						eq(bookings.listingId, listingIdForCount),
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
					.where(eq(listings.id, listingIdForCount));
			}
			console.log('Update successful');
			return { success: true };
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
	},
	requestAmendment: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const bookingId = formData.get('bookingId') as string;
		const message = formData.get('message') as string;
		const changes = formData.getAll('changes') as string[];

		if (!bookingId) {
			return fail(400, { message: 'Missing booking ID' });
		}

		const booking = await db.query.bookings.findFirst({
			where: eq(bookings.id, bookingId),
			with: {
				renter: true,
				listing: {
					with: {
						owner: true
					}
				}
			}
		});

		if (!booking) {
			return fail(404, { message: 'Booking not found' });
		}

		if (booking.listing.ownerId !== locals.user.id) {
			return fail(403, { message: 'Forbidden' });
		}

		try {
			// Update booking status
			await db
				.update(bookings)
				.set({
					status: 'AMENDMENT_REQUESTED',
					amendmentRequests: { fields: changes, message, from: 'OWNER' }
				})
				.where(eq(bookings.id, bookingId));

			// Send Email
			await sendAmendmentRequestedEmail({
				toEmail: booking.renter.email,
				toName: booking.renter.firstName,
				listingTitle: booking.listing.title,
				requestedBy: `${booking.listing.owner.firstName} (Owner)`,
				changes: changes.map((c) => c.replace(/([A-Z])/g, ' $1').trim()), // Format camelCase to readable
				message,
				bookingUrl: `${process.env.ORIGIN || 'http://localhost:5173'}/profile`
			});
		} catch (e) {
			console.error('Failed to request amendment:', e);
			return fail(500, { message: 'Failed to request amendment' });
		}

		return { success: true };
	},
	updateBooking: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const bookingId = formData.get('bookingId') as string;
		const pickupTime = formData.get('pickupTime') as string;
		const returnTime = formData.get('returnTime') as string;

		if (!bookingId) {
			return fail(400, { message: 'Missing booking ID' });
		}

		const booking = await db.query.bookings.findFirst({
			where: eq(bookings.id, bookingId),
			with: {
				listing: {
					with: {
						owner: true
					}
				},
				renter: true
			}
		});

		if (!booking) {
			return fail(404, { message: 'Booking not found' });
		}

		if (booking.renterId !== locals.user.id) {
			return fail(403, { message: 'Forbidden' });
		}

		try {
			const updateData: any = {
				status: 'PENDING', // Reset to PENDING for owner approval
				amendmentRequests: null // Clear amendment request
			};
			const updatedFields: string[] = [];

			if (pickupTime) {
				updateData.pickupTime = pickupTime;
				updatedFields.push('Pickup Time');
			}
			if (returnTime) {
				updateData.returnTime = returnTime;
				updatedFields.push('Return Time');
			}

			await db.update(bookings).set(updateData).where(eq(bookings.id, bookingId));

			// Send Email Notification to Owner
			await sendBookingUpdatedByRenterEmail({
				ownerEmail: booking.listing.owner.email,
				ownerName: booking.listing.owner.firstName,
				renterName: booking.renter.firstName,
				listingTitle: booking.listing.title,
				updatedFields
			});
		} catch (e) {
			console.error('Failed to update booking:', e);
			return fail(500, { message: 'Failed to update booking' });
		}

		return { success: true };
	}
};
