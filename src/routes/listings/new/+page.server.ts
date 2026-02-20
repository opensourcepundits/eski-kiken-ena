import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
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
		const deposit = formData.get('deposit') as string;
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

		// Handle image uploads
		const imageCount = parseInt(formData.get('imageCount') as string) || 0;
		const imagePaths: string[] = [];

		if (imageCount < 1) {
			return fail(400, { message: 'At least 1 image is required.' });
		}

		if (imageCount > 5) {
			return fail(400, { message: 'Maximum 5 images allowed.' });
		}

		// Process and save images to Vercel Blob
		try {
			for (let i = 0; i < imageCount; i++) {
				const file = formData.get(`image_${i}`) as File;
				if (!file || !file.name) continue;

				// Validate file type
				if (!file.type.startsWith('image/')) {
					return fail(400, { message: 'Only image files are allowed.' });
				}

				// Validate file size (5MB limit)
				if (file.size > 5 * 1024 * 1024) {
					return fail(400, { message: 'Images must be less than 5MB.' });
				}

				// Upload to Vercel Blob
				const blob = await put(`listings/${randomUUID()}-${file.name}`, file, {
					access: 'public',
					contentType: file.type
				});

				imagePaths.push(blob.url);
			}
		} catch (error) {
			console.error('Error saving images to Vercel Blob:', error);
			return fail(500, { message: 'Error uploading images.' });
		}

		if (!title || !category || !pricePerDay || !dispatch) {
			return fail(400, { message: 'Missing required fields.' });
		}

		// Location is required for PICKUP_OR_DELIVERY, optional for PICKUP_ONLY and DELIVER_ONLY
		if (dispatch === 'PICKUP_OR_DELIVERY' && (!lat || !lng)) {
			return fail(400, { message: 'Location is required. Please select a location on the map.' });
		}

		// Validate delivery areas if dispatch requires it
		if ((dispatch === 'DELIVER_ONLY' || dispatch === 'PICKUP_OR_DELIVERY') && !deliveryAreas) {
			return fail(400, { message: 'Delivery areas are required for delivery options.' });
		}

		try {
			await db.insert(listings).values({
				ownerId: locals.user.id,
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
				deposit: deposit || '0',
				replacementValue,
				transportSize,
				dispatch,

				deliveryAreas: (dispatch === 'DELIVER_ONLY' || dispatch === 'PICKUP_OR_DELIVERY') ? deliveryAreas : null,
				images: imagePaths,
				operatingHours: {
					start: operatingHoursStart || '09:00',
					end: operatingHoursEnd || '17:00'
				},
				isActive: true,
				bufferDays: bufferDays >= 0 ? bufferDays : 0,
				headsUpDays: headsUpDays >= 0 ? headsUpDays : 0
			});
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Internal Server Error' });
		}

		throw redirect(302, '/listings');
	}
};
