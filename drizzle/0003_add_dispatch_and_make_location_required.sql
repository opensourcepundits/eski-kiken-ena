-- Add dispatch enum
CREATE TYPE "public"."dispatch" AS ENUM('DELIVER_ONLY', 'PICKUP_ONLY', 'PICKUP_OR_DELIVERY');

-- Add dispatch and delivery_areas columns to listings
ALTER TABLE "listings" ADD COLUMN "dispatch" "dispatch" NOT NULL DEFAULT 'PICKUP_ONLY';
ALTER TABLE "listings" ADD COLUMN "delivery_areas" text;

-- Note: lat and lng are optional (nullable) - required only for DELIVER_ONLY and PICKUP_OR_DELIVERY
-- They can be null for PICKUP_ONLY listings

-- Make district nullable (removed from UI, will be derived or set to default)
ALTER TABLE "listings" ALTER COLUMN "district" DROP NOT NULL;
