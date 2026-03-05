import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!dbUrl) {
    console.error('❌ DATABASE_URL or POSTGRES_URL is not set');
    process.exit(1);
}

const migrationClient = postgres(dbUrl, { max: 1 });

async function runMigration() {
    const db = drizzle(migrationClient);
    console.log('⏳ Running migrations...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('✅ Migrations completed!');
    await migrationClient.end();
}

runMigration().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
