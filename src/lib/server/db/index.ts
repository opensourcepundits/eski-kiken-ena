import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

const client = postgres(env.POSTGRES_URL || 'postgres://postgres:postgres@localhost:5432/eke', {
	prepare: false,
	ssl: process.env.NODE_ENV === 'production' ? 'require' : false
});

export const db = drizzle(client, { schema });
