CREATE TYPE "public"."dispatch" AS ENUM('DELIVER_ONLY', 'PICKUP_ONLY', 'PICKUP_OR_DELIVERY');--> statement-breakpoint
CREATE TYPE "public"."id_type" AS ENUM('NIC', 'PASSPORT');--> statement-breakpoint
ALTER TYPE "public"."booking_status" ADD VALUE 'EXPIRED';--> statement-breakpoint
ALTER TYPE "public"."booking_status" ADD VALUE 'AMENDMENT_REQUESTED';--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"renter_id" uuid NOT NULL,
	"rating" smallint NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "district" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "pickup_time" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "return_time" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "renter_message" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "owner_message" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "chosen_dispatch" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "delivery_lat" double precision;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "delivery_lng" double precision;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "delivery_address" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "amendment_requests" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "dispatch" "dispatch" NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "delivery_areas" text;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "avg_days" numeric(10, 1) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "total_earnings" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "avg_earnings" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "operating_hours" jsonb DEFAULT '{"start":"09:00","end":"17:00"}'::jsonb;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "buffer_days" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "heads_up_days" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tnc" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_renter_id_users_id_fk" FOREIGN KEY ("renter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "count";--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "deposit";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "kyc_status";--> statement-breakpoint
DROP TYPE "public"."kyc_status";