import { redirect } from "next/navigation";
import { Signup } from "./signup";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import { Paths } from "@/lib/constants";

export const metadata = {
  title: "Sign Up",
  description: "Signup Page",
};

export default async function SignupPage() {
  const { user } = await validateRequest();

  if (user) redirect(Paths.FCR);

  return <Signup />;
}
