import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const listing = await db.query.listings.findFirst({
        where: and(eq(listings.id, params.id), eq(listings.ownerId, locals.user.id))
    });

    if (!listing) {
        throw error(404, 'Listing not found');
    }

    return { listing };
};

export const actions: Actions = {
    default: async ({ request, params, locals }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const brand = formData.get('brand') as string;
        const modelNumber = formData.get('modelNumber') as string;
        const category = formData.get('category') as any;
        const condition = formData.get('condition') as any;
        const powerSourceRaw = formData.get('powerSource');
        const powerSource = powerSourceRaw ? (powerSourceRaw as any) : null;

        const pickupAddress = formData.get('pickupAddress') as string;
        const pricePerDay = formData.get('pricePerDay') as string;
        const replacementValue = formData.get('replacementValue') as string;
        const transportSizeRaw = formData.get('transportSize');
        const transportSize = transportSizeRaw ? (transportSizeRaw as any) : null;
        const dispatch = formData.get('dispatch') as any;
        const deliveryAreas = formData.get('deliveryAreas') as string;
        const lat = formData.get('lat') ? parseFloat(formData.get('lat') as string) : null;
        const lng = formData.get('lng') ? parseFloat(formData.get('lng') as string) : null;
        const bufferDays = formData.get('bufferDays') ? parseInt(formData.get('bufferDays') as string) : 0;
        const headsUpDays = formData.get('headsUpDays') ? parseInt(formData.get('headsUpDays') as string) : 0;

        const operatingHoursStart = formData.get('operatingHoursStart') as string;
        const operatingHoursEnd = formData.get('operatingHoursEnd') as string;

        if (!title || !category || !pricePerDay || !dispatch) {
            return fail(400, { message: 'Missing required fields' });
        }

        try {
            await db
                .update(listings)
                .set({
                    title,
                    description,
                    brand,
                    modelNumber,
                    category,
                    condition,
                    powerSource,

                    pickupAddress,
                    lat,
                    lng,
                    pricePerDay,
                    replacementValue,
                    transportSize,
                    dispatch,
                    deliveryAreas: (dispatch === 'DELIVER_ONLY' || dispatch === 'PICKUP_OR_DELIVERY') ? deliveryAreas : null,
                    operatingHours: {
                        start: operatingHoursStart || '09:00',
                        end: operatingHoursEnd || '17:00'
                    },
                    bufferDays: bufferDays >= 0 ? bufferDays : 0,
                    headsUpDays: headsUpDays >= 0 ? headsUpDays : 0,
                    updatedAt: new Date()
                })
                .where(and(eq(listings.id, params.id), eq(listings.ownerId, locals.user.id)));
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Failed to update listing' });
        }

        throw redirect(302, `/profile`);
    }
};