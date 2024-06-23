"use server";

import { processFieldErrors } from "@/lib/utils";
import {
  ChangeCurrentOrg,
  CreateOrgInput,
  changeCurrentOrgSchema,
  createOrgSchema,
} from "@/lib/validators/organization";
import { db } from "@/server/db";
import { organizations, sessions, userOrganizations } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { lucia } from "../auth";
import { validateRequest } from "../auth/validate-request";

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  error?: string;
  success?: boolean | string;
}
export async function CreateOrg(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<CreateOrgInput>> {
  const { user, session } = await validateRequest();
  const obj = Object.fromEntries(formData.entries());
  if (!session) return { error: "No session found" };
  try {
    const parsed = await createOrgSchema.safeParseAsync(obj);
    if (!parsed.success) {
      if (apiCall) {
        return { error: processFieldErrors(parsed.error) };
      }
      const err = parsed.error.flatten();

      return {
        fieldError: {
          orgName: err.fieldErrors.orgName?.[0],
        },
      };
    }
    const { orgName } = parsed.data;
    if (orgName && user) {
      const organization = await db
        .insert(organizations)
        .values({
          name: orgName,
          createdBy: user.id,
        })
        .returning();
      if (organization[0])
        await db.insert(userOrganizations).values({
          organizationId: organization[0]?.id || "",
          userId: user.id,
        });
      const dbResult = await db
        .update(sessions)
        .set({ organization: organization[0]?.id })
        .where(eq(sessions.id, session.id));
      const sessionResult = await lucia.validateSession(session.id);
      return { success: "Organization Created" + Date.now() };
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
