ALTER TABLE "dp_cycles" RENAME COLUMN "user_id" TO "created_by";--> statement-breakpoint
ALTER TABLE "dp_cycles" DROP CONSTRAINT "dp_cycles_user_id_dp_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dp_cycles" ADD CONSTRAINT "dp_cycles_created_by_dp_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."dp_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
