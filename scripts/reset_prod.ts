import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

// Use argument if provided, otherwise fallback to env
const dbUrl = process.argv[2] || process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!dbUrl) {
    console.error('❌ No Database URL provided as argument or in env');
    process.exit(1);
}

const sql = postgres(dbUrl, { max: 1 });

async function reset() {
    console.log('⏳ Deep wiping database at:', dbUrl.split('@')[1]); // Log host only for safety

    await sql`DROP SCHEMA IF EXISTS public CASCADE`;
    await sql`CREATE SCHEMA public`;
    await sql`GRANT ALL ON SCHEMA public TO public`;
    await sql`DROP SCHEMA IF EXISTS drizzle CASCADE`;

    console.log('✅ Production Database deeply wiped!');
    await sql.end();
}

reset().catch((err) => {
    console.error('❌ Reset failed:', err);
    process.exit(1);
});
