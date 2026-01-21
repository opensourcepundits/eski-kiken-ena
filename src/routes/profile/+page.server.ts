import { db } from '$lib/server/db';
import { bookings, listings } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { desc, eq, and } from 'drizzle-orm';
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
        where: (table, { exists }) =>
            exists(
                db
                    .select()
                    .from(listings)
                    .where(and(eq(listings.id, table.listingId), eq(listings.ownerId, userId)))
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
    }
};
