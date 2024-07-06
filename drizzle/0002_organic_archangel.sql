DO $$ BEGIN
 CREATE TYPE "public"."notification_type" AS ENUM('normal', 'cycle', 'farmerBilling', 'companyBilling', 'invitation');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dp_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipient_id" varchar NOT NULL,
	"notification_type" "notification_type" DEFAULT 'normal' NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notification_recipient_index" ON "dp_notifications" USING btree ("recipient_id");