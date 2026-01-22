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
	'DISPUTED'
]);
export const kycStatusEnum = pgEnum('kyc_status', ['PENDING', 'VERIFIED', 'REJECTED', 'NONE']);

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
	kycStatus: kycStatusEnum('kyc_status').default('PENDING'),
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
	deposit: decimal('deposit', { precision: 10, scale: 2 }).default('0'),
	replacementValue: decimal('replacement_value', { precision: 10, scale: 2 }),

	// Media & Metadata
	images: jsonb('images').default([]),
	includes: jsonb('includes').default([]),

	// Status & Cache
	rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
	reviewCount: integer('review_count').default(0),
	count: integer('count').default(0),
	isActive: boolean('is_active').default(true),

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
	createdAt: timestamp('created_at').defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	listings: many(listings),
	bookings: many(bookings)
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
	owner: one(users, {
		fields: [listings.ownerId],
		references: [users.id]
	}),
	bookings: many(bookings)
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
