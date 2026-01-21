import { db } from '$lib/server/db';
import { listings, users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const allListings = await db.query.listings.findMany({
        orderBy: [desc(listings.createdAt)],
        with: {
            owner: true
        }
    });

    return {
        listings: allListings
    };
};
