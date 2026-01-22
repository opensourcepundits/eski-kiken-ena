-- Move count column from bookings to listings table
-- First, add count column to listings table
ALTER TABLE "listings" ADD COLUMN "count" integer DEFAULT 0;

-- Initialize count for existing listings based on confirmed bookings
UPDATE "listings" 
SET "count" = (
    SELECT COUNT(*) 
    FROM "bookings" 
    WHERE "bookings"."listing_id" = "listings"."id" 
    AND "bookings"."status" = 'CONFIRMED'
);

-- Remove count column from bookings table
ALTER TABLE "bookings" DROP COLUMN "count";
