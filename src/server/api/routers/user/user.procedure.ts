import { db } from "@/server/db";
import { protectedProcedure, createTRPCRouter } from "../../trpc";
import {
  FCRStandards,
  FCRTable,
  cycles,
  farmer,
  notifications,
  organizations,
  userOrganizations,
  users,
} from "@/server/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { feed } from "@/app/(main)/_types";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => ctx.user),
  getFcrStandards: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.organization) {
      const result = await db
        .select({
          age: FCRStandards.age,
          stdWeight: FCRStandards.stdWeight,
          stdFcr: FCRStandards.stdFcr,
        })
        .from(FCRStandards)
        .where(eq(FCRStandards.organization, ctx.session.organization))
        .orderBy(FCRStandards.age);
      return result;
    } else {
      return [];
    }

    // console.log(result);
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
  getFCRHistory: protectedProcedure
    .input(
      z
        .object({
          cycleId: z.string({ invalid_type_error: "invalid uuid" }).optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      if (ctx.session && ctx.user) {
        if (input?.cycleId) {
          try {
            const result = await db
              .select()
              .from(FCRTable)

              .where(and(eq(FCRTable.userId, ctx.user.id), eq(FCRTable.cycleId, input.cycleId)))
              .orderBy(desc(FCRTable.createdAt));
            return result.map((singleResult) => {
              return {
                ...singleResult,
                totalFeed: singleResult.totalFeed as feed[],
                farmStock: singleResult.farmStock as feed[],
              };
            });
          } catch (error: any) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: (error as Error).message,
            });
          }
        }
        try {
          const result = await db
            .select()
            .from(FCRTable)

            .where(eq(FCRTable.userId, ctx.user.id))
            .orderBy(desc(FCRTable.createdAt)) // Correctly reference the users table

            .execute();
          return result.map((singleResult) => {
            return {
              ...singleResult,
              totalFeed: singleResult.totalFeed as feed[],
              farmStock: singleResult.farmStock as feed[],
            };
          });
        } catch (error: any) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: (error as Error).message });
        }
      }
    }),
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session && ctx.user) {
      try {
        const result = await db
          .select({
            eventType: notifications.eventType,
            message: notifications.message,
            cycleId: notifications.cycleId,
            invitationId: notifications.invitationId,
            time: notifications.createdAt,
            id: notifications.id,
          })
          .from(notifications)

          .where(eq(notifications.recipient, ctx.user.id))
          .orderBy(desc(notifications.createdAt))
          .limit(10) // Correctly reference the users table

          .execute();

        console.log(result);
        return result;
      } catch (error) {
        console.log(error);
      }
    }
  }),
  getFarmers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.organization && ctx.user) {
      try {
        const result = await db
          .select({ name: farmer.name, location: farmer.location, id: farmer.id })
          .from(farmer)
          // Correctly reference the users table
          .where(eq(farmer.organizationId, ctx.session.organization))
          .execute();

        console.log(result);
        return result;
      } catch (error) {
        console.log(error);
      }
    }
  }),
  getCycles: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.organization && ctx.user) {
      try {
        const result = await db
          .select({
            farmerName: farmer.name,
            farmerLocation: farmer.location,
            farmerId: farmer.id,
            id: cycles.id,
            totalDoc: cycles.totalDoc,
            strain: cycles.strain,
            age: cycles.age,
            ended: cycles.ended,
            endDate: cycles.endDate,
            startDate: cycles.createdAt,

            createdBy: {
              firstName: users.firstName,
              lastName: users.lastName,
              id: users.id,
              email: users.email,
            },
            lastFCR: {
              id: FCRTable.id,
              createdAt: FCRTable.createdAt,
              totalMortality: FCRTable.totalMortality,
              stdFcr: FCRTable.stdFcr,
              stdWeight: FCRTable.stdWeight,
              fcr: FCRTable.fcr,
              avgWeight: FCRTable.avgWeight,
              lastDayMortality: FCRTable.todayMortality,
              age: FCRTable.age,
              totalFeed: FCRTable.totalFeed,
              farmStock: FCRTable.farmStock,
            },
          })
          .from(cycles)
          .innerJoin(farmer, eq(cycles.farmerId, farmer.id))
          .innerJoin(users, eq(users.id, cycles.createdBy))
          .leftJoin(FCRTable, eq(FCRTable.id, cycles.lastFcrId))
          // Correctly reference the users table
          .where(and(eq(cycles.organizationId, ctx.session.organization), eq(cycles.ended, false)))
          .execute();

        console.log(result);

        return result.map((row) => {
          const totalFeed = row.lastFCR?.totalFeed;
          console.log(totalFeed);
          return {
            ...row,
            lastFCR: row.lastFCR?.id
              ? {
                  ...row.lastFCR,
                  totalFeed: totalFeed as feed[],
                  farmStock: row.lastFCR.farmStock as feed[],
                }
              : null,
          };
        });
      } catch (error) {
        console.log(error);
      }
    }
  }),
});
