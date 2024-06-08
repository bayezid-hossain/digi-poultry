import { type ReactNode } from "react";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { validateRequest } from "@/lib/auth/validate-request";
import { redirect } from "next/navigation";
import { Paths } from "@/lib/constants";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);
  if (user && !user.emailVerified) redirect(Paths.VerifyEmail);
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
