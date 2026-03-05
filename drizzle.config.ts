import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.POSTGRES_URL || ''
	},
	migrations: {
		path: './src/lib/server/db/migrations'
	}
});
