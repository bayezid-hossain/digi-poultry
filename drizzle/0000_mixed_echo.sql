DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('company', 'farmer', 'investor');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dp_fcrStandards" (
	"age" integer PRIMARY KEY NOT NULL,
	"stdWeight" integer NOT NULL,
	"stdFcr" double precision NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "dp_fcrStandards_age_unique" UNIQUE("age")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dp_fcrRecord" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"farmer_name" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"location" varchar(50) DEFAULT 'Bhaluka' NOT NULL,
	"total_doc" double precision DEFAULT 0 NOT NULL,
	"strain" varchar(50) DEFAULT 'Ross A',
	"fcr" double precision DEFAULT 0 NOT NULL,
	"std_fcr" double precision DEFAULT 0 NOT NULL,
	"std_weight" integer DEFAULT 500 NOT NULL,
	"avg_weight" double precision DEFAULT 0 NOT NULL,
	"age" double precision DEFAULT 22 NOT NULL,
	"today_mortality" double precision DEFAULT 22 NOT NULL,
	"total_mortality" double precision DEFAULT 22 NOT NULL,
	"disease" varchar(50) DEFAULT 'none',
	"medicine" varchar(50) DEFAULT 'none',
	"total_feed" jsonb DEFAULT '{"510":0,"511":0}'::jsonb,
	"farm_stock" jsonb DEFAULT '{"510":0,"511":0}'::jsonb,
	"user_id" varchar(21) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dp_email_verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(8) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "dp_email_verification_codes_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dp_organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_by" varchar NOT NULL,
	CONSTRAINT "dp_organizations_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dp_password_reset_tokens" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dp_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"isUserVerified" boolean DEFAULT false NOT NULL,
	"organization_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dp_userOrganizations" (
	"user_id" varchar NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dp_users" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"hashed_password" varchar(255),
	"avatar" varchar(255),
	"userType" "type" DEFAULT 'farmer' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "dp_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fcr_std_org_idx" ON "dp_fcrStandards" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fcr_user_idx" ON "dp_fcrRecord" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_code_user_idx" ON "dp_email_verification_codes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_code_email_idx" ON "dp_email_verification_codes" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "password_token_user_idx" ON "dp_password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_idx" ON "dp_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "dp_users" USING btree ("email");