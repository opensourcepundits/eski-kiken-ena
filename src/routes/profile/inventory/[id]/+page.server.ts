import { db } from '$lib/server/db';
import { bookings, listings } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { desc, eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

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
