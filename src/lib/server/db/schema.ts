import {
	pgTable,
	text,
	timestamp,
	uuid,
	pgEnum,
	jsonb,
	decimal,
	boolean,
	smallint,
	integer,
	doublePrecision
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['USER', 'ADMIN']);
export const districtEnum = pgEnum('district', [
	'PORT_LOUIS',
	'PAMPLEMOUSSES',
	'RIVIERE_DU_REMPART',
	'FLACQ',
	'GRAND_PORT',
	'SAVANNE',
	'PLAINES_WILHEMS',
	'MOKA',
	'BLACK_RIVER',
	'RODRIGUES'
]);
export const bookingStatusEnum = pgEnum('booking_status', [
	'PENDING',
	'CONFIRMED',
	'PAID',
	'ACTIVE',
	'COMPLETED',
	'CANCELLED',
	'DISPUTED',
	'EXPIRED',
	'AMENDMENT_REQUESTED'
]);

export const idTypeEnum = pgEnum('id_type', ['NIC', 'PASSPORT']);


export const categoryEnum = pgEnum('category', [
	'POWER_TOOLS',
	'GARDENING',
	'CONSTRUCTION',
	'CLEANING',
	'AUTOMOTIVE',
	'GENERATORS',
	'LADDERS',
	'SCAFFOLDING',
	'OTHER'
]);
export const conditionEnum = pgEnum('condition', ['LIKE_NEW', 'GOOD', 'FUNCTIONAL', 'HEAVY_WEAR']);
export const powerSourceEnum = pgEnum('power_source', [
	'BATTERY',
	'CORDED_220V',
	'PETROL',
	'DIESEL',
	'MANUAL'
]);
export const transportSizeEnum = pgEnum('transport_size', [
	'BACKPACK',
	'CAR_TRUNK',
	'BACKSEAT',
	'PICKUP_TRUCK',
	'VAN_REQUIRED'
]);
export const dispatchEnum = pgEnum('dispatch', [
	'DELIVER_ONLY',
	'PICKUP_ONLY',
	'PICKUP_OR_DELIVERY'
]);

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	hashedPassword: text('hashed_password').notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	phone: text('phone'),
	role: roleEnum('role').default('USER'),


	profileImage: text('profile_image'),
	reputation: smallint('reputation'),
	createdAt: timestamp('created_at').defaultNow()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const listings = pgTable('listings', {
	id: uuid('id').primaryKey().defaultRandom(),
	ownerId: uuid('owner_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),

	// Core Info
	title: text('title').notNull(),
	description: text('description').notNull(),
	brand: text('brand'),
	modelNumber: text('model_number'),

	// Classification
	category: categoryEnum('category').notNull(),
	condition: conditionEnum('condition').default('GOOD'),
	powerSource: powerSourceEnum('power_source'),

	// Logistics
	district: districtEnum('district'),
	pickupAddress: text('pickup_address'),
	lat: doublePrecision('lat'),
	lng: doublePrecision('lng'),
	transportSize: transportSizeEnum('transport_size'),
	dispatch: dispatchEnum('dispatch').notNull(),
	deliveryAreas: text('delivery_areas'),

	// Financials
	pricePerDay: decimal('price_per_day', { precision: 10, scale: 2 }).notNull(),
	replacementValue: decimal('replacement_value', { precision: 10, scale: 2 }),

	// Media & Metadata
	images: jsonb('images').default([]),
	includes: jsonb('includes').default([]),

	// Status & Cache
	rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
	reviewCount: integer('review_count').default(0),
	count: integer('count').default(0),
	avgDays: decimal('avg_days', { precision: 10, scale: 1 }).default('0'),
	totalEarnings: decimal('total_earnings', { precision: 10, scale: 2 }).default('0'),
	avgEarnings: decimal('avg_earnings', { precision: 10, scale: 2 }).default('0'),
	operatingHours: jsonb('operating_hours').default({ start: '09:00', end: '17:00' }), // Default 9-5
	isActive: boolean('is_active').default(true),
	bufferDays: integer('buffer_days').default(0),
	headsUpDays: integer('heads_up_days').default(0),

	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const bookings = pgTable('bookings', {
	id: uuid('id').primaryKey().defaultRandom(),
	listingId: uuid('listing_id')
		.notNull()
		.references(() => listings.id, { onDelete: 'cascade' }),
	renterId: uuid('renter_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	startDate: timestamp('start_date').notNull(),
	endDate: timestamp('end_date').notNull(),
	totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
	status: bookingStatusEnum('status').default('PENDING'),
	pickupTime: text('pickup_time'), // HH:mm format
	returnTime: text('return_time'), // HH:mm format
	renterMessage: text('renter_message'),
	ownerMessage: text('owner_message'),
	chosenDispatch: text('chosen_dispatch'), // 'PICKUP' or 'DELIVERY'
	deliveryLat: doublePrecision('delivery_lat'),
	deliveryLng: doublePrecision('delivery_lng'),
	deliveryAddress: text('delivery_address'),
	expiresAt: timestamp('expires_at'),
	createdAt: timestamp('created_at').defaultNow(),
	amendmentRequests: jsonb('amendment_requests').default({}) // Stores { fields: ['pickupTime', 'returnTime'], message: string, from: 'OWNER' | 'RENTER' }
});



// Relations
export const usersRelations = relations(users, ({ many }) => ({
	listings: many(listings),
	bookings: many(bookings),
	ratings: many(ratings)
}));



export const listingsRelations = relations(listings, ({ one, many }) => ({
	owner: one(users, {
		fields: [listings.ownerId],
		references: [users.id]
	}),
	bookings: many(bookings),
	ratings: many(ratings)
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
	listing: one(listings, {
		fields: [bookings.listingId],
		references: [listings.id]
	}),
	renter: one(users, {
		fields: [bookings.renterId],
		references: [users.id]
	})
}));

export const ratings = pgTable('ratings', {
	id: uuid('id').primaryKey().defaultRandom(),
	listingId: uuid('listing_id')
		.notNull()
		.references(() => listings.id, { onDelete: 'cascade' }),
	renterId: uuid('renter_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	rating: smallint('rating').notNull(),
	comment: text('comment'),
	createdAt: timestamp('created_at').defaultNow()
});

export const ratingsRelations = relations(ratings, ({ one }) => ({
	listing: one(listings, {
		fields: [ratings.listingId],
		references: [listings.id]
	}),
	renter: one(users, {
		fields: [ratings.renterId],
		references: [users.id]
	})
}));
