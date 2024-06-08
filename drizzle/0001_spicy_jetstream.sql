ALTER TABLE "dp_users" RENAME COLUMN "type" TO "userType";--> statement-breakpoint
ALTER TABLE "dp_users" ALTER COLUMN "userType" SET DEFAULT 'farmer';--> statement-breakpoint
ALTER TABLE "dp_users" ALTER COLUMN "userType" SET NOT NULL;