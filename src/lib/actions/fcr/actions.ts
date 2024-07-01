"use server";
const UNDEFINED_NUMBER = -99999;

import { StandardData } from "@/app/(main)/_types";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import { processFieldErrors, standardData } from "@/lib/utils";
import {
  AddSingleStandardRow,
  CreateFCRInput,
  DeleteMultipleRowFCR,
  DeleteSingleRowFCR,
  UpdateSingleRowFCR,
  deleteMultipleRowFCR,
  deleteSingleRowFCR,
  fcrSchema,
  multiStandardSchema,
  singleStandardSchema,
  updateSingleRowSchema,
} from "@/lib/validators/fcr";
import { db } from "@/server/db";
import { FCRStandards, FCRTable } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { redirect } from "next/navigation";
import { PostgresError } from "postgres";
import { ZodError } from "zod";

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  error?: string;
  success?: boolean | string;
}
export async function updateSingleStandardRow(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<UpdateSingleRowFCR>> {
  try {
    const { user, session } = await validateRequest();
    if ((apiCall && !user) ?? (apiCall && !session?.organization))
      return { error: "No session found" };
    const obj = Object.fromEntries(formData.entries());
    const newObj = {
      ...obj,
      age: obj.age !== undefined ? parseFloat(obj.age.toString()) : UNDEFINED_NUMBER,
      previousAge:
        obj.previousAge !== undefined ? parseFloat(obj.previousAge.toString()) : UNDEFINED_NUMBER,
      stdFcr: obj.stdFcr !== undefined ? parseFloat(obj.stdFcr.toString()) : UNDEFINED_NUMBER,
      stdWeight:
        obj.stdWeight !== undefined ? parseFloat(obj.stdWeight.toString()) : UNDEFINED_NUMBER,
    };
    // console.log(newObj);
    const parsed = await updateSingleRowSchema.safeParseAsync(newObj);
    if (!parsed.success) {
      // console.log(parsed);
      if (apiCall) return { error: processFieldErrors(parsed.error) };
      const err = parsed.error.flatten();
      return {
        fieldError: {
          age: err.fieldErrors.age?.[0],
          previousAge: err.fieldErrors.previousAge?.[0],
          stdFcr: err.fieldErrors.stdFcr?.[0],
          stdWeight: err.fieldErrors.stdWeight?.[0],
        },
      };
    }
    const { age, stdFcr, stdWeight, previousAge } = newObj;
    session?.organization &&
      (await db
        .update(FCRStandards)
        .set({ age, stdFcr, stdWeight })
        .where(
          and(
            eq(FCRStandards.age, previousAge),
            eq(FCRStandards.organization, session.organization),
          ),
        ));
    return { success: true };
  } catch (error: any) {
    const convertedError = error as PostgresError;
    if (convertedError.code == "23505") {
      const duplicateErrorMessage = `Age ${convertedError.detail?.substring(convertedError.detail.indexOf("=") + 2, convertedError.detail.lastIndexOf(","))} for your organization already exists.`;
      return {
        formError: duplicateErrorMessage,
      };
    }
    const message = convertedError.detail
      ?.replaceAll("=", " ")
      .replaceAll("(", "")
      .replaceAll(")", "");
    return { formError: message };
  }
}

export async function importStandardTable(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<AddSingleStandardRow>> {
  const { user, session } = await validateRequest();
  if (apiCall && !user) return { error: "No session found" };
  else if (apiCall && !session?.organization)
    return { error: "You have to be a part of na organization, please join or create one" };

  if (!session?.organization) return { formError: "You have to be a part of na organization" };
  else {
    const entriesWithOrgId = standardData.map((entry) => ({
      ...entry,
      organization: session?.organization ?? "",
    }));
    const result = await db.insert(FCRStandards).values(entriesWithOrgId);
    return { success: "Imported" + Date.now() };
  }
}
export async function addSingleStandardRow(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<AddSingleStandardRow>> {
  try {
    const { user, session } = await validateRequest();
    if (apiCall && !user) return { error: "No session found" };
    else if (apiCall && !session?.organization)
      return { error: "You have to be a part of na organization, please join or create one" };

    if (!session?.organization) return { formError: "You have to be a part of na organization" };
    else {
      const obj = Object.fromEntries(formData.entries());
      const newObj = {
        ...obj,
        age: obj.age !== undefined ? parseFloat(obj.age.toString()) : UNDEFINED_NUMBER,
        stdFcr: obj.stdFcr !== undefined ? parseFloat(obj.stdFcr.toString()) : UNDEFINED_NUMBER,
        stdWeight:
          obj.stdWeight !== undefined ? parseFloat(obj.stdWeight.toString()) : UNDEFINED_NUMBER,
      };
      // console.log(newObj);
      const parsed = await singleStandardSchema.safeParseAsync(newObj);
      if (!parsed.success) {
        // console.log(parsed);
        if (apiCall) return { error: processFieldErrors(parsed.error) };
        const err = parsed.error.flatten();
        return {
          fieldError: {
            age: err.fieldErrors.age?.[0],
            stdFcr: err.fieldErrors.stdFcr?.[0],
            stdWeight: err.fieldErrors.stdWeight?.[0],
          },
        };
      }
      const { age, stdFcr, stdWeight } = newObj;
      const result = await db.insert(FCRStandards).values({
        age,
        stdFcr,
        stdWeight,
        organization: session?.organization || "",
      });
      return { success: true };
    }
  } catch (error: any) {
    const convertedError = error as PostgresError;
    if (convertedError.code == "23505") {
      const duplicateErrorMessage = `Age ${convertedError.detail?.substring(convertedError.detail.indexOf("=") + 2, convertedError.detail.lastIndexOf(","))} for your organization already exists.`;
      return {
        formError: duplicateErrorMessage,
      };
    }
    const message = convertedError.detail
      ?.replaceAll("=", " ")
      .replaceAll("(", "")
      .replaceAll(")", "");
    return { formError: message };
  }
}
function extractFieldError(error: ZodError<any>, fieldName: string): string | undefined {
  const fieldError = error.errors.find((err) => err.path[0] === fieldName);
  return fieldError ? fieldError.message : undefined;
}
export async function addMultiStandardRow(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<AddSingleStandardRow>> {
  try {
    const { user, session } = await validateRequest();
    if (apiCall && !user) return { error: "No session found" };
    else if (apiCall && !session?.organization)
      return { error: "You have to be a part of na organization, please join or create one" };

    if (!session?.organization) return { formError: "You have to be a part of an organization" };
    else {
      const obj = Object.fromEntries(formData.entries());
      const entries = JSON.parse(obj?.datas?.toString() ?? "[]") as StandardData[];

      // console.log(newObj);
      const parsed = await multiStandardSchema.safeParseAsync(entries);
      if (!parsed.success) {
        // console.log(parsed);
        if (apiCall) return { error: processFieldErrors(parsed.error) };
        const error = parsed.error.flatten();
        if (error instanceof ZodError) {
          // Extract error messages for specific fields
          const ageError = extractFieldError(error, "age");
          const stdFcrError = extractFieldError(error, "stdFcr");
          const stdWeightError = extractFieldError(error, "stdWeight");

          return {
            fieldError: {
              age: ageError,
              stdFcr: stdFcrError,
              stdWeight: stdWeightError,
            },
          };
        }
      }
      const entriesWithOrgId = entries.map((entry) => ({
        ...entry,
        organization: session?.organization ?? "",
      }));
      const result = await db.insert(FCRStandards).values(entriesWithOrgId);
      return { success: true };
    }
  } catch (error: any) {
    const convertedError = error as PostgresError;
    if (convertedError.code == "23505") {
      const duplicateErrorMessage = `Age ${convertedError.detail?.substring(convertedError.detail.indexOf("=") + 2, convertedError.detail.lastIndexOf(","))} for your organization already exists.`;
      return {
        formError: duplicateErrorMessage,
      };
    }
    const message = convertedError.detail
      ?.replaceAll("=", " ")
      .replaceAll("(", "")
      .replaceAll(")", "");
    return { formError: message };
  }
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
    totalDoc: obj.totalDoc !== undefined ? Number(obj.totalDoc.toString()) : 0,
    totalFeed: JSON.parse(obj?.totalFeed?.toString() ?? "") as [],
    farmStock: JSON.parse(obj?.farmStock?.toString() ?? "") as [],
  };
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
        totalFeed: err.fieldErrors.totalFeed?.[0],
        farmStock: err.fieldErrors.farmStock?.[0],
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
  let feedCalc = 1;
  totalFeed.map((feed) => {
    feedCalc += feed.quantity;
  });
  const fcr = Number(
    ((feedCalc * 50) / ((totalDoc - totalMortality) * (avgWeight / 1000))).toFixed(4),
  );
  try {
    const standards = await db
      .select({ stdFcr: FCRStandards.stdFcr, stdWeight: FCRStandards.stdWeight })
      .from(FCRStandards)
      .where(eq(FCRStandards.age, age));
    if (standards.length === 0) {
      return { formError: "Standard FCR and Weight data not found for given age" };
    }
    const result = await db
      .insert(FCRTable)
      .values({
        id,
        farmerName,
        userId: user?.id ?? "",
        age,
        avgWeight,
        disease,
        fcr,
        stdFcr: standards[0]?.stdFcr,
        stdWeight: standards[0]?.stdWeight,
        location,
        medicine,
        strain,
        todayMortality,
        totalMortality,
        totalDoc,
        farmStock,
        totalFeed,
      })
      .returning({
        farmer: FCRTable.farmerName,
        age: FCRTable.age,
        avgWeight: FCRTable.avgWeight,
        disease: FCRTable.disease,
        fcr: FCRTable.fcr,
        stdFcr: FCRTable.stdFcr,
        stdWeight: FCRTable.stdWeight,
        location: FCRTable.location,
        medicine: FCRTable.medicine,
        strain: FCRTable.strain,
        todayMortality: FCRTable.todayMortality,
        totalMortality: FCRTable.totalMortality,
        totalDoc: FCRTable.totalDoc,
        farmStock: FCRTable.farmStock,
        totalFeed: FCRTable.totalFeed,
        date: FCRTable.createdAt,
        totalFeedQuantity: FCRTable.age,
      });
    return { success: JSON.stringify(result[0]) };
  } catch (error) {
    return { formError: "Couldn't Calculate" };
  }
}
export async function deleteSingleRowFCRStandard(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<DeleteSingleRowFCR>> {
  const { user } = await validateRequest();
  console.log(user);
  if (apiCall && !user) return { error: "No session found" };
  const obj = Object.fromEntries(formData.entries());
  const newObj = {
    ...obj,
    age: obj.age !== undefined ? parseFloat(obj.age.toString()) : UNDEFINED_NUMBER,
  };
  console.log(newObj);
  const parsed = await deleteSingleRowFCR.safeParseAsync(newObj);
  if (!parsed.success) {
    console.log(parsed);
    if (apiCall) return { error: processFieldErrors(parsed.error) };
    const err = parsed.error.flatten();
    return {
      fieldError: {
        age: err.fieldErrors.age?.[0],
      },
    };
  }
  const { age } = newObj;
  const result = await db.delete(FCRStandards).where(eq(FCRStandards.age, Number(age)));
  return { success: true };
}

export async function deleteMultipleRecords(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<DeleteMultipleRowFCR>> {
  const { user } = await validateRequest();
  console.log(user);
  const obj = Object.fromEntries(formData.entries());

  try {
    const ages = obj.ages ? obj.ages.toString().split(",").map(Number) : [];

    if (apiCall && !user) return { error: "No session found" };

    const parsed = await deleteMultipleRowFCR.safeParseAsync(ages);
    if (!parsed.success) {
      console.log(parsed);
      if (apiCall) return { error: processFieldErrors(parsed.error) };
      const err = parsed.error.flatten();
      return {
        formError: "No rows selected",
      };
    }
    await Promise.all(
      ages.map(async (age) => {
        await db.delete(FCRStandards).where(eq(FCRStandards.age, age));
      }),
    );
    return { success: Date.now().toString() };
  } catch (error: any) {
    return { error: (error as Error)?.message };
  }
}
