CREATE TYPE "public"."booking_status" AS ENUM('PENDING', 'CONFIRMED', 'PAID', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED');--> statement-breakpoint
CREATE TYPE "public"."category" AS ENUM('POWER_TOOLS', 'GARDENING', 'CONSTRUCTION', 'CLEANING', 'AUTOMOTIVE', 'GENERATORS', 'LADDERS', 'SCAFFOLDING', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."condition" AS ENUM('LIKE_NEW', 'GOOD', 'FUNCTIONAL', 'HEAVY_WEAR');--> statement-breakpoint
CREATE TYPE "public"."district" AS ENUM('PORT_LOUIS', 'PAMPLEMOUSSES', 'RIVIERE_DU_REMPART', 'FLACQ', 'GRAND_PORT', 'SAVANNE', 'PLAINES_WILHEMS', 'MOKA', 'BLACK_RIVER', 'RODRIGUES');--> statement-breakpoint
CREATE TYPE "public"."kyc_status" AS ENUM('PENDING', 'VERIFIED', 'REJECTED', 'NONE');--> statement-breakpoint
CREATE TYPE "public"."power_source" AS ENUM('BATTERY', 'CORDED_220V', 'PETROL', 'DIESEL', 'MANUAL');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."transport_size" AS ENUM('BACKPACK', 'CAR_TRUNK', 'BACKSEAT', 'PICKUP_TRUCK', 'VAN_REQUIRED');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"renter_id" uuid NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"status" "booking_status" DEFAULT 'PENDING',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"brand" text,
	"model_number" text,
	"category" "category" NOT NULL,
	"condition" "condition" DEFAULT 'GOOD',
	"power_source" "power_source",
	"district" "district" NOT NULL,
	"pickup_address" text,
	"lat" double precision,
	"lng" double precision,
	"transport_size" "transport_size",
	"price_per_day" numeric(10, 2) NOT NULL,
	"deposit" numeric(10, 2) DEFAULT '0',
	"replacement_value" numeric(10, 2),
	"images" jsonb DEFAULT '[]'::jsonb,
	"includes" jsonb DEFAULT '[]'::jsonb,
	"rating" numeric(3, 2) DEFAULT '0',
	"review_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"hashed_password" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"role" "role" DEFAULT 'USER',
	"kyc_status" "kyc_status" DEFAULT 'PENDING',
	"profile_image" text,
	"reputation" smallint,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_renter_id_users_id_fk" FOREIGN KEY ("renter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;