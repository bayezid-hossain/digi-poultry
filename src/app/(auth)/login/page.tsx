import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import { Paths } from "@/lib/constants";
import { Login } from "./login";

export const metadata = {
  title: "Login",
  description: "Login Page",
};

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) redirect(Paths.FCR);

  return <Login />;
}
