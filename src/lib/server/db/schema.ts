import { pgTable, text, timestamp, uuid, pgEnum, jsonb, decimal, boolean, smallint } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['USER', 'ADMIN']);
export const districtEnum = pgEnum('district', [
    'PORT_LOUIS', 'PAMPLEMOUSSES', 'RIVIERE_DU_REMPART', 'FLACQ', 'GRAND_PORT',
    'SAVANNE', 'PLAINES_WILHEMS', 'MOKA', 'BLACK_RIVER', 'RODRIGUES'
]);
export const bookingStatusEnum = pgEnum('booking_status', [
    'PENDING', 'CONFIRMED', 'PAID', 'ACTIVE', 'COMPLETED', 'CANCELLED'
]);
export const kycStatusEnum = pgEnum('kyc_status', ['PENDING', 'VERIFIED', 'REJECTED', 'NONE']);

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
    userId: uuid('user_id').notNull().references(() => users.id),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const listings = pgTable('listings', {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id').notNull().references(() => users.id),
    title: text('title').notNull(),
    description: text('description').notNull(),
    pricePerDay: decimal('price_per_day').notNull(),
    district: districtEnum('district').notNull(),
    images: jsonb('images').default([]),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow()
});

export const bookings = pgTable('bookings', {
    id: uuid('id').primaryKey().defaultRandom(),
    listingId: uuid('listing_id').notNull().references(() => listings.id),
    renterId: uuid('renter_id').notNull().references(() => users.id),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    totalPrice: decimal('total_price').notNull(),
    status: bookingStatusEnum('status').default('PENDING'),
    createdAt: timestamp('created_at').defaultNow()
});
