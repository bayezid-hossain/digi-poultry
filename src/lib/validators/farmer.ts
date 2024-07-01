import { z } from "zod";

export const createFarmerSchema = z.object({
  name: z.string().min(3, "Please enter minimum 3 letters for Farmer Name").max(20),
  location: z.string().min(3, "Please enter minimum 3 letters for Farmer Location").max(20),
});
export type CreateFarmerInput = z.infer<typeof createFarmerSchema>;

export const deleteSingleFarmerValidator = z.object({
  id: z.string({ required_error: "ID is required", invalid_type_error: "ID must be a number" }),
});
export type DeleteSingleFarmer = z.infer<typeof deleteSingleFarmerValidator>;

export const updateFarmerSchema = createFarmerSchema.extend({
  id: z.string().min(3),
});
export type UpdateFarmer = z.infer<typeof updateFarmerSchema>;
