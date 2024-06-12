import { db } from "@/server/db";
import { protectedProcedure, createTRPCRouter } from "../../trpc";
import { FCRStandards } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => ctx.user),
  getFcrStandards: protectedProcedure.query(async ({ ctx }) => {
    const result = await db.select().from(FCRStandards).orderBy(FCRStandards.age);
    // console.log(result);
    return result;
  }),
});
