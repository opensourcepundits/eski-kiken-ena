import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
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
		const district = formData.get('district') as any;
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

		// Handle image uploads
		const imageCount = parseInt(formData.get('imageCount') as string) || 0;
		const imagePaths: string[] = [];

		if (imageCount < 1) {
			return fail(400, { message: 'At least 1 image is required.' });
		}

		if (imageCount > 5) {
			return fail(400, { message: 'Maximum 5 images allowed.' });
		}

		// Process and save images
		try {
			const uploadDir = join(process.cwd(), 'static', 'uploads', 'listings');
			await mkdir(uploadDir, { recursive: true });

			for (let i = 0; i < imageCount; i++) {
				const file = formData.get(`image_${i}`) as File;
				if (!file) continue;

				// Validate file type
				if (!file.type.startsWith('image/')) {
					return fail(400, { message: 'Only image files are allowed.' });
				}

				// Validate file size (5MB limit)
				if (file.size > 5 * 1024 * 1024) {
					return fail(400, { message: 'Images must be less than 5MB.' });
				}

				// Generate unique filename
				const fileExtension = file.name.split('.').pop() || 'jpg';
				const fileName = `${randomUUID()}.${fileExtension}`;
				const filePath = join(uploadDir, fileName);

				// Convert File to Buffer and save
				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);
				await writeFile(filePath, buffer);

				// Store relative path for database
				imagePaths.push(`/uploads/listings/${fileName}`);
			}
		} catch (error) {
			console.error('Error saving images:', error);
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

		// For delivery only, pickup address is not required but location is still needed for map
		// For pickup options, both location and address are recommended

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
				district,
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
				isActive: true
			});
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Internal Server Error' });
		}

		throw redirect(302, '/listings');
	}
};
