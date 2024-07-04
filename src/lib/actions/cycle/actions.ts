"use server";
const UNDEFINED_NUMBER = -99999;

import { processFieldErrors } from "@/lib/utils";
import {
  ChangeCurrentOrg,
  CreateOrgInput,
  changeCurrentOrgSchema,
  createOrgSchema,
} from "@/lib/validators/organization";
import { db } from "@/server/db";
import { cycles, farmer, organizations, sessions, userOrganizations } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { lucia } from "../auth";
import { validateRequest } from "../auth/validate-request";
import {
  DeleteSingleCycle,
  UpdateCycle,
  deleteSingleCycleValidator,
  updateCycleSchema,
} from "@/lib/validators/cycle";
import { PostgresError } from "postgres";
import { CreateCycleInput, createCycleSchema } from "@/lib/validators/cycle";

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  error?: string;
  success?: boolean | string;
}
export async function CreateCycle(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<CreateCycleInput>> {
  const { user, session } = await validateRequest();
  const obj = Object.fromEntries(formData.entries());
  if (!session) return { error: "No session found" };
  const newObj = {
    ...obj,
    age: obj.age !== undefined ? parseFloat(obj.age.toString()) : UNDEFINED_NUMBER,
    totalDoc: obj.totalDoc !== undefined ? parseFloat(obj.totalDoc.toString()) : UNDEFINED_NUMBER,
    totalMortality:
      obj.totalMortality !== undefined
        ? parseFloat(obj.totalMortality.toString())
        : UNDEFINED_NUMBER,
  };
  try {
    const parsed = await createCycleSchema.safeParseAsync(newObj);
    if (!parsed.success) {
      if (apiCall) {
        return { error: processFieldErrors(parsed.error) };
      }
      const err = parsed.error.flatten();

      return {
        fieldError: {
          age: err.fieldErrors.age?.[0],
          strain: err.fieldErrors.strain?.[0],
          totalDoc: err.fieldErrors.totalDoc?.[0],
          totalMortality: err.fieldErrors.totalMortality?.[0],
          farmerId: err.fieldErrors.farmerId?.[0],
        },
      };
    }
    const { age, strain, totalDoc, totalMortality, farmerId } = parsed.data;
    if (user) {
      const newCycle = await db
        .insert(cycles)
        .values({
          createdBy: user.id,
          age,
          farmerId,
          strain,
          totalDoc,
          organizationId: session.organization ?? "",
        })
        .returning();
      if (newCycle[0]) {
        const withFarmerInfo = await db
          .select({ farmerName: farmer.name, farmerLocation: farmer.location })
          .from(farmer)
          .where(eq(farmer.id, newCycle[0].farmerId))
          .execute();
        return { success: JSON.stringify({ ...newCycle[0], ...withFarmerInfo[0] }) };
      } else {
        return { error: "Something went wrong" };
      }
    } else return { error: "Something went wrong" };
  } catch (error: any) {
    return { error: (error as Error)?.message };
  }
}

export async function ChangeOrganization(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<ChangeCurrentOrg>> {
  const { user, session } = await validateRequest();
  const obj = Object.fromEntries(formData.entries());
  if (!session) return { error: "No session found" };
  try {
    const parsed = await changeCurrentOrgSchema.safeParseAsync(obj);
    if (!parsed.success) {
      if (apiCall) {
        return { error: processFieldErrors(parsed.error) };
      }
      const err = parsed.error.flatten();

      return {
        fieldError: {
          orgId: err.fieldErrors.orgId?.[0],
        },
      };
    }
    const { orgId } = parsed.data;
    if (orgId && user) {
      const dbResult = await db
        .update(sessions)
        .set({ organization: orgId })
        .where(eq(sessions.id, session.id));
      const sessionResult = await lucia.validateSession(session.id);
      return { success: "Current Organization Changed to " + session.organization };
    } else return { error: "Something went wrong" };
  } catch (error: any) {
    return { error: (error as Error)?.message };
  }
}

export async function deleteSingleCycle(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<DeleteSingleCycle>> {
  const { user } = await validateRequest();
  if (apiCall && !user) return { error: "No session found" };
  const obj = Object.fromEntries(formData.entries());
  const newObj = {
    id: obj.id,
  };
  const parsed = await deleteSingleCycleValidator.safeParseAsync(newObj);
  if (!parsed.success) {
    if (apiCall) return { error: processFieldErrors(parsed.error) };
    const err = parsed.error.flatten();
    return {
      fieldError: {
        id: err.fieldErrors.id?.[0],
      },
    };
  }
  const { id } = newObj;
  const result = await db.delete(cycles).where(eq(cycles.id, id?.toString() ?? "nothing"));
  return { success: result.toString() + Date.now() };
}

// export async function updateSingleCycle(
//   _: any,
//   formData: FormData,
//   apiCall?: boolean,
// ): Promise<ActionResponse<UpdateCycle>> {
//   try {
//     const { user, session } = await validateRequest();
//     if ((apiCall && !user) ?? (apiCall && !session?.organization))
//       return { error: "No session found" };
//     const obj = Object.fromEntries(formData.entries());

//     // console.log(newObj);
//     const parsed = await updateCycleSchema.safeParseAsync(obj);
//     if (!parsed.success) {
//       // console.log(parsed);
//       if (apiCall) return { error: processFieldErrors(parsed.error) };
//       const err = parsed.error.flatten();
//       return {
//         fieldError: {
//           // location: err.fieldErrors.location?.[0],
//           // name: err.fieldErrors.name?.[0],
//           // id: err.fieldErrors.id?.[0],
//         },
//       };
//     }
//     const { name, location, id } = obj;
//     (name as string) &&
//       location &&
//       id &&
//       session?.organization &&
//       (await db
//         .update(cycles)
//         .set()
//         .where(
//           and(
//             eq(cycles.id, id?.toString() ?? "none"),
//             eq(cycles.organizationId, session.organization),
//           ),
//         ));
//     return { success: Date.now().toString() };
//   } catch (error: any) {
//     const convertedError = error as PostgresError;
//     if (convertedError.code == "23505") {
//       const duplicateErrorMessage = `id ${convertedError.detail?.substring(convertedError.detail.indexOf("=") + 2, convertedError.detail.lastIndexOf(","))} for your organization already exists.`;
//       return {
//         formError: duplicateErrorMessage,
//       };
//     }
//     const message = convertedError.detail
//       ?.replaceAll("=", " ")
//       .replaceAll("(", "")
//       .replaceAll(")", "");
//     return { formError: message };
//   }
// }
