"use server";

import { processFieldErrors } from "@/lib/utils";
import {
  ChangeCurrentOrg,
  CreateOrgInput,
  InvitePeople,
  changeCurrentOrgSchema,
  createOrgSchema,
  invitePeopleSchema,
} from "@/lib/validators/organization";
import { db } from "@/server/db";
import {
  invites,
  notifications,
  organizations,
  sessions,
  unRegisteredEmails,
  userOrganizations,
  users,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { lucia } from "../auth";
import { validateRequest } from "../auth/validate-request";
import { PostgresError } from "postgres";

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
export async function Invite(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<InvitePeople>> {
  const { user, session } = await validateRequest();
  if (user && session.organization) {
    const obj = Object.fromEntries(formData.entries());
    if (!session) return { error: "No session found" };
    try {
      const parsed = await invitePeopleSchema.safeParseAsync(obj);
      if (!parsed.success) {
        if (apiCall) {
          return { error: processFieldErrors(parsed.error) };
        }
        const err = parsed.error.flatten();

        return {
          fieldError: {
            to: err.fieldErrors.to?.[0],
          },
        };
      }
      const { to, cycleId } = parsed.data;
      if (to === user.email) {
        return { error: "You can't invite yourself" };
      }
      const orgNameAndUserId = await db
        .select({ orgName: organizations.name, userId: users.id })
        .from(organizations)
        .where(eq(organizations.id, session.organization))
        .leftJoin(users, eq(users.email, to));
      const message = `${user.firstName + " " + user.lastName} has invited you to join ${cycleId ? " a cycle in the  organization " + orgNameAndUserId[0]?.orgName : orgNameAndUserId[0]?.orgName}`;
      const inviteId = await db
        .insert(invites)
        .values({
          email: to,
          message,
          organizationId: session.organization,
          cycleId: cycleId ?? "",
        })
        .returning({ id: invites.id });
      try {
        if (!orgNameAndUserId[0]?.userId) await db.insert(unRegisteredEmails).values({ email: to });
      } catch (error) {}
      await db.insert(notifications).values({
        recipient: orgNameAndUserId[0]?.userId?.toString() ?? to,
        message: message,
        eventType: "invitation",
        cycleId: cycleId,
        invitationId: inviteId[0]?.id.toString(),
      });
      return { success: "Invitation Sent!" + to };
    } catch (error: any) {
      const convertedError = error as PostgresError;
      if (convertedError.code == "23505") {
        const duplicateErrorMessage = `You already sent invitation to this email.`;
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
  } else {
    return { error: "No session found" };
  }
}
