import { db } from "@/server/db";
import { protectedProcedure, createTRPCRouter } from "../../trpc";
import {
  FCRStandards,
  FCRTable,
  organizations,
  userOrganizations,
  users,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => ctx.user),
  getFcrStandards: protectedProcedure.query(async ({ ctx }) => {
    const result = await db
      .select()
      .from(FCRStandards)
      .where(
        eq(FCRStandards.organization, ctx.session.organization ? ctx.session.organization : ""),
      )
      .orderBy(FCRStandards.age);
    // console.log(result);
    return result;
  }),
  getOrganizations: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session && ctx.user) {
      const result = await db
        .select({
          id: organizations.id,
          name: organizations.name,
        })
        .from(userOrganizations)
        .innerJoin(users, eq(users.id, userOrganizations.userId)) // Join the users table
        .innerJoin(organizations, eq(organizations.id, userOrganizations.organizationId)) // Join the organizations table
        .where(eq(users.id, ctx.user.id)) // Correctly reference the users table
        .orderBy(organizations.name)
        .execute();

      console.log(result);
      return result;
    }
  }),
  getFCRHistory: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session && ctx.user) {
      try {
        const result = await db
          .select()
          .from(FCRTable)

          .where(eq(FCRTable.userId, ctx.user.id)) // Correctly reference the users table

          .execute();

        console.log(result);
        return result;
      } catch (error) {
        console.log(error);
      }
    }
  }),
});
