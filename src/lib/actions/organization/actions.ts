"use server";

import { processFieldErrors } from "@/lib/utils";
import {
  ChangeCurrentOrg,
  CreateOrgInput,
  InvitePeople,
  JoinOrg,
  changeCurrentOrgSchema,
  createOrgSchema,
  invitePeopleSchema,
  joinOrgSchema,
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
import { and, eq } from "drizzle-orm";
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

      const inviteId = await db
        .insert(invites)
        .values({
          email: to,
          organizationId: session.organization,
          cycleId: cycleId ?? "",
          from: user.id,
        })
        .returning({ id: invites.id });
      const recipientUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, to));
      try {
        if (!recipientUser[0]?.id) await db.insert(unRegisteredEmails).values({ email: to });
      } catch (error) {}
      await db.insert(notifications).values({
        recipient: recipientUser[0]?.id?.toString() ?? to,
        eventType: "invitation",
        cycleId: cycleId,
        invitationId: inviteId[0]?.id?.toString() ?? null,
        message: "",
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

export async function JoinOrganization(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<JoinOrg>> {
  const { user, session } = await validateRequest();
  const obj = Object.fromEntries(formData.entries());
  if (!session) return { error: "No session found" };
  try {
    const parsed = await joinOrgSchema.safeParseAsync(obj);
    if (!parsed.success) {
      if (apiCall) {
        return { error: processFieldErrors(parsed.error) };
      }
      const err = parsed.error.flatten();

      return {
        fieldError: {
          invitationId: err.fieldErrors.invitationId?.[0],
        },
      };
    }
    const { invitationId } = parsed.data;
    if (invitationId && user) {
      const invitationInfo = await db
        .select({
          from: invites.from,
          to: invites.email,
          id: invites.id,
          orgId: invites.organizationId,
          cycleId: invites.cycleId,
          inviteStatus: invites.action,
        })
        .from(invites)
        .where(eq(invites.id, invitationId));
      if (invitationInfo[0]) {
        const { from, to, id, orgId, cycleId, inviteStatus } = invitationInfo[0];
        if (to === user.email) {
          if (inviteStatus === "PENDING") {
            const checkAlreadyAMember = await db
              .select()
              .from(userOrganizations)
              .where(
                and(
                  eq(userOrganizations.userId, user.id),
                  eq(userOrganizations.organizationId, orgId),
                ),
              );
            if (checkAlreadyAMember.length === 0) {
              await db.insert(userOrganizations).values({
                organizationId: orgId,
                userId: user.id,
              });
            }
            await db
              .update(invites)
              .set({ action: "ACCEPTED" })
              .where(eq(invites.id, invitationId));
            await db
              .update(notifications)
              .set({ isRead: true })
              .where(eq(notifications.invitationId, invitationId));
            await db
              .update(sessions)
              .set({ organization: orgId })
              .where(eq(sessions.id, session.id));
            const sessionResult = await lucia.validateSession(session.id);
            return { success: "Current Organization Changed to " + session.organization };
          }
          return { error: "You already Accepted/Declined this invitaion" };
        }
        return { error: "Invitation Not for You" };
      } else {
        return { error: "Invalid invitation" };
      }
    } else return { error: "Something went wrong" };
  } catch (error: any) {
    return { error: (error as Error)?.message };
  }
}
export async function RejectInvitation(
  _: any,
  formData: FormData,
  apiCall?: boolean,
): Promise<ActionResponse<JoinOrg>> {
  const { user, session } = await validateRequest();
  const obj = Object.fromEntries(formData.entries());
  if (!session) return { error: "No session found" };
  try {
    const parsed = await joinOrgSchema.safeParseAsync(obj);
    if (!parsed.success) {
      if (apiCall) {
        return { error: processFieldErrors(parsed.error) };
      }
      const err = parsed.error.flatten();

      return {
        fieldError: {
          invitationId: err.fieldErrors.invitationId?.[0],
        },
      };
    }
    const { invitationId } = parsed.data;
    if (invitationId && user) {
      await db.update(invites).set({ action: "REJECTED" }).where(eq(invites.id, invitationId));
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.invitationId, invitationId));
      return { success: "Invitation Rejected" };
    } else return { error: "Something went wrong" };
  } catch (error: any) {
    return { error: (error as Error)?.message };
  }
}
