import { z } from "zod";

export const fcrSchema = z.object({
  farmerName: z.string().min(3, "Please enter minimum 3 letters for Farmer Name").max(20),
  location: z.string().min(3, "Please enter minimum 3 letters for Location").max(20),
  totalDoc: z
    .number({
      required_error: "Total DOC is required",
      invalid_type_error: "Total DOC must be a number",
    })
    .default(0),
  strain: z
    .string()
    .min(3, "Please enter minimum 3 letters for Strain name")
    .max(20, "Strain name cannot have more than 20 letters")
    .default("Ross A"),

  avgWeight: z
    .number({
      required_error: "Average Weight is required",
      invalid_type_error: "Average Weight must be a number",
    })
    .default(0.0),
  age: z
    .number({ required_error: "Age is required", invalid_type_error: "Age must be a number" })
    .gt(1)
    .default(1),
  todayMortality: z
    .number({
      required_error: "Today Mortality is required",
      invalid_type_error: "Today Mortality must be a number",
    })
    .gt(-1)
    .default(0),
  totalMortality: z
    .number({
      required_error: "Total Mortality is required",
      invalid_type_error: "Total Mortality must be a number",
    })
    .gt(-1)
    .default(0),
  disease: z
    .string()
    .min(3, "Please enter minimum 3 letters for Disease name")
    .max(20, "Disease name cannot have more than 20 letters")
    .default("None")
    .refine(async () => {
      return true;
    }),
  medicine: z
    .string()
    .min(3, "Please enter minimum 3 letters for Medicine name")
    .max(20, "Medicine name cannot have more than 20 letters")
    .default("None"),
  totalFeed: z.object(
    {
      510: z
        .number({
          required_error: "Total Mortality is required",
          invalid_type_error: "Total Mortality must be a number",
        })
        .gt(-1),
      511: z
        .number({
          required_error: "Total Mortality is required",
          invalid_type_error: "Total Mortality must be a number",
        })
        .gt(-1),
    },
    { required_error: "Total Feed Required", invalid_type_error: "Invalid Total Feed Data" },
  ),
  farmStock: z.object(
    {
      510: z
        .number({
          required_error: "Total Mortality is required",
          invalid_type_error: "Total Mortality must be a number",
        })
        .gt(-1),
      511: z
        .number({
          required_error: "Total Mortality is required",
          invalid_type_error: "Total Mortality must be a number",
        })
        .gt(-1),
    },
    { required_error: "Farm Stock Required", invalid_type_error: "Invalid Farm Stock Data" },
  ),
});

export type CreateFCRInput = z.infer<typeof fcrSchema>;

export const singleStandardSchema = z.object({
  age: z
    .number({ required_error: "Age is required", invalid_type_error: "Age must be a number" })
    .gt(0, { message: "Age must be greater than 0" }),
  stdFcr: z
    .number({
      required_error: "Standard FCR is required",
      invalid_type_error: "Standard FCR must be a number",
    })
    .gt(0, { message: "Standard FCR must be greater than 0" }),
  stdWeight: z
    .number({
      required_error: "Standard Weight is required",
      invalid_type_error: "standard Weight must be a number",
    })
    .gt(0, { message: "Standard Weight must be greater than 0" }),
});

export type AddSingleStandardRow = z.infer<typeof singleStandardSchema>;

export const multiStandardSchema = z.array(singleStandardSchema);
export type AddMultipleStandardRow = z.infer<typeof multiStandardSchema>;
export const deleteSingleRowFCR = z.object({
  age: z
    .number({ required_error: "Age is required", invalid_type_error: "Age must be a number" })
    .gt(0, { message: "Age must be greater than 0" }),
});
export type DeleteSingleRowFCR = z.infer<typeof deleteSingleRowFCR>;

export const deleteMultipleRowFCR = z.number().array();

export type DeleteMultipleRowFCR = z.infer<typeof deleteMultipleRowFCR>;
export const updateSingleRowSchema = singleStandardSchema.extend({
  previousAge: z
    .number({
      required_error: "Previous Age is required",
      invalid_type_error: "Previous Age must be a number",
    })
    .gt(0, { message: "Previous Age must be greater than 0" }),
});
export type UpdateSingleRowFCR = z.infer<typeof updateSingleRowSchema>;
