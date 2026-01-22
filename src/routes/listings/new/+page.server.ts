import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

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
		const powerSource = formData.get('powerSource') as any;
		const district = formData.get('district') as any;
		const pickupAddress = formData.get('pickupAddress') as string;
		const pricePerDay = formData.get('pricePerDay') as string;
		const deposit = formData.get('deposit') as string;
		const replacementValue = formData.get('replacementValue') as string;
		const transportSize = formData.get('transportSize') as any;
		const lat = formData.get('lat') ? parseFloat(formData.get('lat') as string) : null;
		const lng = formData.get('lng') ? parseFloat(formData.get('lng') as string) : null;

		if (!title || !category || !district || !pricePerDay) {
			return fail(400, { message: 'Missing required fields' });
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
				district,
				pickupAddress,
				lat,
				lng,
				pricePerDay,
				deposit: deposit || '0',
				replacementValue,
				transportSize,
				isActive: true
			});
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Internal Server Error' });
		}

		throw redirect(302, '/listings');
	}
};
