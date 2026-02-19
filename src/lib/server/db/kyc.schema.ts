import { pgTable, text, uuid, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './schema';

const idTypeEnum = pgEnum('kyc_id_type', ['NIC', 'Passport']);
export const kyc = pgTable('kyc', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	surname: text('surname').notNull(),
	id_type: idTypeEnum('id_type'),
	identifier_number: varchar('identifier_number', { length: 100 }),
	nationality: varchar('nationality', { length: 100 }),
	document_url: varchar('document_url', { length: 255 }),
	user_id: uuid('user_id')
		.references(() => users.id)
		.notNull(),
	createdAt: timestamp('created_at').defaultNow()
});

export const kycRelations = relations(kyc, ({ one }) => ({}));
