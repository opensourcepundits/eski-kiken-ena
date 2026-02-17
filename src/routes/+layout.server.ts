import type { LayoutServerLoad } from './$types';
import { checkExpiredBookings } from '$lib/server/workers/expiry';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Lightweight background check (in a real app, use a proper cron/worker)
	if (Math.random() < 0.1) { // 10% chance to run on page load to avoid spamming db
		// We don't await this so it doesn't block the page load
		checkExpiredBookings().catch(err => console.error('Background expiry check failed', err));
	}

	return {
		user: locals.user
	};
};
