import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(3, "Please enter minimum 3 letters for First Name").max(20),
  lastName: z.string().min(3, "Please enter minimum 3 letters for Last Name").max(20),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password has to be of atleast 8 characters").max(255),
  userType: z.enum(["company", "farmer", "investor"], {
    errorMap: () => ({
      message: 'Invalid user type, valid types are "farmer", "company", "investor"',
    }),
  }),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password is too short. Minimum 8 characters required.").max(255),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Invalid token"),
  password: z.string().min(8, "Password is too short").max(255),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
