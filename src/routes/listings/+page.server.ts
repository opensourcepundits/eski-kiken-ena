import { db } from '$lib/server/db';
import { listings, users } from '$lib/server/db/schema';
import { eq, desc, and, or, gte, lte, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Get filter parameters from URL
	const category = url.searchParams.get('category');
	const condition = url.searchParams.get('condition');
	const powerSource = url.searchParams.get('powerSource');

	const transportSize = url.searchParams.get('transportSize');
	const minPrice = url.searchParams.get('minPrice');
	const maxPrice = url.searchParams.get('maxPrice');
	const sortBy = url.searchParams.get('sortBy') || 'newest';
	const searchQuery = url.searchParams.get('q') || '';

	// Build filter conditions
	const conditions = [];

	if (category) {
		conditions.push(eq(listings.category, category as any));
	}
	if (condition) {
		conditions.push(eq(listings.condition, condition as any));
	}
	if (powerSource) {
		conditions.push(eq(listings.powerSource, powerSource as any));
	}

	if (transportSize) {
		conditions.push(eq(listings.transportSize, transportSize as any));
	}
	if (minPrice) {
		conditions.push(gte(listings.pricePerDay, minPrice));
	}
	if (maxPrice) {
		conditions.push(lte(listings.pricePerDay, maxPrice));
	}

	// Always filter active listings
	conditions.push(eq(listings.isActive, true));

	// Build where clause
	const whereClause = conditions.length > 0 ? and(...conditions) : eq(listings.isActive, true);

	// Determine sort order
	let orderBy;
	switch (sortBy) {
		case 'price-low':
			orderBy = [listings.pricePerDay];
			break;
		case 'price-high':
			orderBy = [desc(listings.pricePerDay)];
			break;
		case 'newest':
		default:
			orderBy = [desc(listings.createdAt)];
			break;
	}

	const allListings = await db.query.listings.findMany({
		where: whereClause,
		orderBy,
		with: {
			owner: true
		}
	});

	// Filter by search query if provided (client-side filtering for text search)
	let filteredListings = allListings;
	if (searchQuery) {
		const query = searchQuery.toLowerCase();
		filteredListings = allListings.filter(
			(listing) =>
				listing.title.toLowerCase().includes(query) ||
				listing.description?.toLowerCase().includes(query) ||
				listing.brand?.toLowerCase().includes(query) ||
				listing.category?.toLowerCase().includes(query)
		);
	}

	return {
		listings: filteredListings,
		filters: {
			category,
			condition,
			powerSource,

			transportSize,
			minPrice,
			maxPrice,
			sortBy,
			searchQuery
		}
	};
};
