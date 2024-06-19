import { type ReactNode } from "react";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import { redirect } from "next/navigation";
import { Paths } from "@/lib/constants";
import { api } from "@/trpc/server";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const { user, session } = await validateRequest();
  if (!user) redirect(Paths.Login);
  if (user && !session.isUserVerified) redirect(Paths.VerifyEmail);
  const organizations = await api.user.getOrganizations.query();

  return (
    <>
      {organizations ? (
        <Header organizations={organizations} currentOrg={session.organization} />
      ) : (
        <Header />
      )}
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
