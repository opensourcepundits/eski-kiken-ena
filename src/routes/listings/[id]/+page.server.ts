import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { listings, bookings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const listing = await db.query.listings.findFirst({
		where: eq(listings.id, params.id),
		with: {
			owner: true,
			bookings: {
				where: (bookings, { ne }) => ne(bookings.status, 'CANCELLED')
			}
		}
	});

	if (!listing) {
		throw error(404, 'Listing not found');
	}

	return {
		listing
	};
};

export const actions: Actions = {
	book: async ({ params, request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Verify out identity avan fer enn booking' });
		}

		const formData = await request.formData();
		const startDate = formData.get('startDate') as string;
		const endDate = formData.get('endDate') as string;

		if (!startDate || !endDate) {
			return fail(400, { message: 'Svp swazir ban date' });
		}

		const start = new Date(startDate);
		const end = new Date(endDate);

		if (end <= start) {
			return fail(400, { message: 'Date la pa bon' });
		}

		const listing = await db.query.listings.findFirst({
			where: eq(listings.id, params.id)
		});

		if (!listing) {
			return error(404, 'Listing missing');
		}

		// Calculate total price: (Price per day * days) + Deposit
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const rentalCost = Number(listing.pricePerDay) * diffDays;
		const deposit = Number(listing.deposit || 0);
		const totalPrice = (rentalCost + deposit).toFixed(2);

		try {
			await db.insert(bookings).values({
				listingId: params.id,
				renterId: locals.user.id,
				startDate: start,
				endDate: end,
				totalPrice: totalPrice,
				status: 'PENDING'
			});
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Enn erreur finn arive, svp reessaye plizir' });
		}

		throw redirect(303, '/profile');
	}
};
