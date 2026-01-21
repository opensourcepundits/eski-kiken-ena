import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const listing = await db.query.listings.findFirst({
        where: eq(listings.id, params.id),
        with: {
            owner: true
        }
    });

    if (!listing) {
        throw error(404, 'Listing not found');
    }

    return {
        listing
    };
};
