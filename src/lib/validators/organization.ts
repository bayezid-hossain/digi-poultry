import { z } from "zod";

export const createOrgSchema = z.object({
  orgName: z.string().min(3, "Please enter minimum 3 letters for Organization Name").max(20),
});
export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export const changeCurrentOrgSchema = z.object({
  orgId: z.string().uuid("Please enter valid Organization Id"),
});

export type ChangeCurrentOrg = z.infer<typeof changeCurrentOrgSchema>;
export const invitePeopleSchema = z.object({
  cycleId: z.string().optional(),
  to: z.string({ required_error: "Please provide Email" }).email("Please enter a valid email"),
});

export type InvitePeople = z.infer<typeof invitePeopleSchema>;

export const joinOrgSchema = z.object({
  invitationId: z.string().uuid("Please enter Invitation id"),
});

export type JoinOrg = z.infer<typeof joinOrgSchema>;
