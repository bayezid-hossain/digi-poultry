CREATE TABLE IF NOT EXISTS "dp_farmerCycles" (
	"farmer_id" uuid NOT NULL,
	"cycle_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dp_userCycles" (
	"user_id" varchar NOT NULL,
	"cycle_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dp_farmer" ADD COLUMN "organization_id" uuid NOT NULL;