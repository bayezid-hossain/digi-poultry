import { z } from "zod";

export const createOrgSchema = z.object({
  orgName: z.string().min(3, "Please enter minimum 3 letters for Organization Name").max(20),
});
export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export const changeCurrentOrgSchema = z.object({
  orgId: z.string().uuid("Please enter valid Organization Id"),
});

export type ChangeCurrentOrg = z.infer<typeof changeCurrentOrgSchema>;
