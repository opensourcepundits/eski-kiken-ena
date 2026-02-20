import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/server/db/schema';
import { listings, kyc } from '../src/lib/server/db/schema';
import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';
import { join, basename } from 'path';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const client = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgres://postgres:postgres@localhost:5432/eke', {
    prepare: false
});
const db = drizzle(client, { schema });

async function migrate() {
    console.log('Starting migration to Vercel Blob...');

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('Error: BLOB_READ_WRITE_TOKEN is not set in .env');
        process.exit(1);
    }

    // 1. Migrate Listings Images
    console.log('Migrating listing images...');
    const allListings = await db.select().from(listings);

    for (const listing of allListings) {
        if (!listing.images || !Array.isArray(listing.images)) continue;

        const newImageUrls: string[] = [];
        let updated = false;

        for (const imagePath of listing.images as string[]) {
            if (imagePath.startsWith('http')) {
                newImageUrls.push(imagePath);
                continue;
            }

            try {
                const localPath = join(process.cwd(), 'static', imagePath);
                const fileContent = await readFile(localPath);
                const fileName = basename(imagePath);

                console.log(`Uploading ${fileName}...`);
                const blob = await put(`listings/${fileName}`, fileContent, {
                    access: 'public',
                    contentType: getContentType(fileName)
                });

                newImageUrls.push(blob.url);
                updated = true;
            } catch (error) {
                console.error(`Failed to migrate image ${imagePath}:`, error);
                newImageUrls.push(imagePath); // Keep old path if upload fails
            }
        }

        if (updated) {
            await db.update(listings)
                .set({ images: newImageUrls })
                .where(eq(listings.id, listing.id));
            console.log(`Updated listing ${listing.id}`);
        }
    }

    // 2. Migrate KYC Documents
    console.log('Migrating KYC documents...');
    const allKyc = await db.select().from(kyc);

    for (const entry of allKyc) {
        if (!entry.documentImage || entry.documentImage.startsWith('http')) continue;

        try {
            const localPath = join(process.cwd(), 'static', entry.documentImage);
            const fileContent = await readFile(localPath);
            const fileName = basename(entry.documentImage);

            console.log(`Uploading KYC doc ${fileName}...`);
            const blob = await put(`kyc/${fileName}`, fileContent, {
                access: 'public',
                contentType: getContentType(fileName)
            });

            await db.update(kyc)
                .set({ documentImage: blob.url })
                .where(eq(kyc.id, entry.id));
            console.log(`Updated KYC entry ${entry.id}`);
        } catch (error) {
            console.error(`Failed to migrate KYC doc ${entry.documentImage}:`, error);
        }
    }

    console.log('Migration completed!');
}

function getContentType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'webp':
            return 'image/webp';
        case 'gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}

migrate().catch(console.error);
