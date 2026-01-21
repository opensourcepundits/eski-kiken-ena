import { db } from '$lib/server/db';
import { bookings, listings } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

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
    const ownerBookings = await db.query.bookings.findMany({
        where: (table, { exists }) => exists(
            db.select().from(listings)
                .where(eq(listings.id, table.listingId))
                .where(eq(listings.ownerId, locals.user.id))
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
