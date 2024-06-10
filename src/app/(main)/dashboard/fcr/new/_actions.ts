"use server";

import { lucia } from "@/lib/auth";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { processFieldErrors } from "@/lib/utils";
import { CreateFCRInput, fcrSchema } from "@/lib/validators/fcr";
import { db } from "@/server/db";
import { FCRStandards, FCRTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  error?: string;
  success?: boolean;
}
export async function createFCR(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<CreateFCRInput>> {
  const { user } = await validateRequest();
  const obj = Object.fromEntries(formData.entries());
  console.log(typeof obj.age);
  const newObj = {
    ...obj,
    age: obj.age !== undefined ? parseFloat(obj.age.toString()) : 0,
    avgWeight: obj.avgWeight !== undefined ? parseFloat(obj.avgWeight.toString()) : 0,
    todayMortality:
      obj.todayMortality !== undefined ? parseFloat(obj.todayMortality.toString()) : 0,
    totalMortality:
      obj.totalMortality !== undefined ? parseFloat(obj.totalMortality.toString()) : 0,
    totalDOC: obj.totalDOC !== undefined ? parseFloat(obj.totalDOC.toString()) : 0,
    totalFeed: {
      510: obj.feed510 !== undefined ? parseFloat(obj.feed510.toString()) : 0,
      511: obj.feed511 !== undefined ? parseFloat(obj.feed511.toString()) : 0,
    },
    farmStock: {
      510: obj.stock510 !== undefined ? parseFloat(obj.stock510.toString()) : 0,
      511: obj.stock511 !== undefined ? parseFloat(obj.stock511.toString()) : 0,
    },
  };
  console.log(newObj);
  const parsed = await fcrSchema.safeParseAsync(newObj);
  if (!parsed.success) {
    console.log(parsed);
    if (apiCall) return { error: processFieldErrors(parsed.error) };
    const err = parsed.error.flatten();
    return {
      fieldError: {
        age: err.fieldErrors.age?.[0],
        avgWeight: err.fieldErrors.avgWeight?.[0],
        disease: err.fieldErrors.disease?.[0],
        farmerName: err.fieldErrors.farmerName?.[0],
        location: err.fieldErrors.location?.[0],
        todayMortality: err.fieldErrors.todayMortality?.[0],
        totalMortality: err.fieldErrors.totalMortality?.[0],
        totalDoc: err.fieldErrors.totalDoc?.[0],
        strain: err.fieldErrors.strain?.[0],
        medicine: err.fieldErrors.medicine?.[0],
      },
    };
  }
  const {
    age,
    avgWeight,
    disease,
    farmStock,
    farmerName,
    location,
    medicine,
    strain,
    todayMortality,
    totalDoc,
    totalFeed,
    totalMortality,
  } = parsed.data;
  const id = generateId(21);

  if (apiCall) return { success: true };
  await db.transaction(async (tx) => {
    const standards = await tx
      .select({ stdFcr: FCRStandards.stdFcr, stdWeight: FCRStandards.stdWeight })
      .from(FCRStandards)
      .where(eq(FCRStandards.age, age));
    console.log(standards);
    const result = await db
      .insert(FCRTable)
      .values({
        id,
        farmerName,
        userId: user?.id ?? "",
        age,
        avgWeight,
        disease,
        fcr: 0.3,
        location,
        medicine,
        strain,
        todayMortality,
        totalMortality,
        totalDoc,
        farmStock,
        totalFeed,
      })
      .returning();
  });
  return redirect("/dashboard/fcr");
}
