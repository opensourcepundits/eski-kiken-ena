import { db } from '$lib/server/db';
import { bookings } from '$lib/server/db/schema';
import { sendBookingExpiredEmail } from '$lib/server/email';
import { lt, and, eq } from 'drizzle-orm';

/**
 * Checks for bookings that remain in 'PENDING' state past their expiration time.
 * If found, marks them as 'EXPIRED' and sends a notification email to the renter.
 * 
 * This should be called periodically (e.g., via a cron job or scheduled task).
 */
export async function checkExpiredBookings() {
    const now = new Date();

    try {
        // Find expired pending bookings
        const expiredBookings = await db.query.bookings.findMany({
            where: and(
                eq(bookings.status, 'PENDING'),
                lt(bookings.expiresAt, now)
            ),
            with: {
                renter: true,
                listing: {
                    with: {
                        owner: true
                    }
                }
            }
        });

        if (expiredBookings.length === 0) {
            return;
        }

        console.log(`Found ${expiredBookings.length} expired bookings.`);

        for (const booking of expiredBookings) {

            // 1. Update status to EXPIRED
            await db.update(bookings)
                .set({ status: 'EXPIRED' })
                .where(eq(bookings.id, booking.id));

            // 2. Send email notification
            if (booking.renter && booking.renter.email) {
                await sendBookingExpiredEmail({
                    renterEmail: booking.renter.email,
                    renterName: booking.renter.firstName,
                    listingTitle: booking.listing.title,
                    bookingUrl: `${process.env.ORIGIN || 'http://localhost:5173'}/listings/${booking.listingId}`
                });
            }
        }

    } catch (error) {
        console.error('Error processing expired bookings:', error);
    }
}
