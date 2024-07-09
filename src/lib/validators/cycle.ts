import { z } from "zod";
import { feedSchema } from "./fcr";

export const createCycleSchema = z.object({
  totalDoc: z
    .number({
      required_error: "Total DOC is required",
      invalid_type_error: "Total DOC must be a number",
    })
    .gt(-1, { message: "DOC Should be greater than 0" }),
  farmerId: z.string({
    required_error: "Farmer ID is required",
  }),
  age: z
    .number({ required_error: "Age is required", invalid_type_error: "Age must be a number" })
    .gt(-1)
    .default(1),
  strain: z
    .string()
    .min(3, "Please enter minimum 3 letters for Strain name")
    .max(20, "Strain name cannot have more than 20 letters")
    .default("Ross A"),
});
export type CreateCycleInput = z.infer<typeof createCycleSchema>;

export const deleteSingleCycleValidator = z.object({
  id: z.string({ required_error: "ID is required", invalid_type_error: "ID must be a number" }),
});
export type DeleteSingleCycle = z.infer<typeof deleteSingleCycleValidator>;

export const updateCycleSchema = createCycleSchema.extend({
  id: z.string({ required_error: "ID is required", invalid_type_error: "ID must be a number" }),
});
export type UpdateCycle = z.infer<typeof updateCycleSchema>;
