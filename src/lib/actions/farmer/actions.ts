"use server";

import { processFieldErrors } from "@/lib/utils";
import {
  ChangeCurrentOrg,
  CreateOrgInput,
  changeCurrentOrgSchema,
  createOrgSchema,
} from "@/lib/validators/organization";
import { db } from "@/server/db";
import { farmer, organizations, sessions, userOrganizations } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { lucia } from "../auth";
import { validateRequest } from "../auth/validate-request";
import {
  CreateFarmerInput,
  DeleteSingleFarmer,
  UpdateFarmer,
  createFarmerSchema,
  deleteSingleFarmerValidator,
  updateFarmerSchema,
} from "@/lib/validators/farmer";
import { PostgresError } from "postgres";

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  error?: string;
  success?: boolean | string;
}
export async function CreateFarmer(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<CreateFarmerInput>> {
  const { user, session } = await validateRequest();
  const obj = Object.fromEntries(formData.entries());
  if (!session) return { error: "No session found" };
  try {
    const parsed = await createFarmerSchema.safeParseAsync(obj);
    if (!parsed.success) {
      if (apiCall) {
        return { error: processFieldErrors(parsed.error) };
      }
      const err = parsed.error.flatten();

      return {
        fieldError: {
          name: err.fieldErrors.name?.[0],
          location: err.fieldErrors.location?.[0],
        },
      };
    }
    const { name, location } = parsed.data;
    if (name && user) {
      const newFarmer = await db
        .insert(farmer)
        .values({
          name: name,
          location: location,
          organizationId: session.organization ?? "",
        })
        .returning();

      const sessionResult = await lucia.validateSession(session.id);
      return { success: JSON.stringify(newFarmer[0]) };
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

export async function deleteSingleFarmer(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<DeleteSingleFarmer>> {
  const { user } = await validateRequest();
  if (apiCall && !user) return { error: "No session found" };
  const obj = Object.fromEntries(formData.entries());
  const newObj = {
    id: obj.id,
  };
  const parsed = await deleteSingleFarmerValidator.safeParseAsync(newObj);
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
  const result = await db.delete(farmer).where(eq(farmer.id, id?.toString() ?? "nothing"));
  return { success: result.toString() + Date.now() };
}

export async function updateSingleFarmer(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<UpdateFarmer>> {
  try {
    const { user, session } = await validateRequest();
    if ((apiCall && !user) ?? (apiCall && !session?.organization))
      return { error: "No session found" };
    const obj = Object.fromEntries(formData.entries());

    // console.log(newObj);
    const parsed = await updateFarmerSchema.safeParseAsync(obj);
    if (!parsed.success) {
      // console.log(parsed);
      if (apiCall) return { error: processFieldErrors(parsed.error) };
      const err = parsed.error.flatten();
      return {
        fieldError: {
          location: err.fieldErrors.location?.[0],
          name: err.fieldErrors.name?.[0],
          id: err.fieldErrors.id?.[0],
        },
      };
    }
    const { name, location, id } = obj;
    if (name && location && id && session?.organization) {
      const updatedFarmer = await db
        .update(farmer)
        .set({ name: name?.toString(), location: location.toString() })
        .where(
          and(
            eq(farmer.id, id?.toString() ?? "none"),
            eq(farmer.organizationId, session.organization),
          ),
        )
        .returning();
      return { success: JSON.stringify(updatedFarmer[0]) };
    } else return { error: "Could not update farmer " };
  } catch (error: any) {
    const convertedError = error as PostgresError;
    if (convertedError.code == "23505") {
      const duplicateErrorMessage = `id ${convertedError.detail?.substring(convertedError.detail.indexOf("=") + 2, convertedError.detail.lastIndexOf(","))} for your organization already exists.`;
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
