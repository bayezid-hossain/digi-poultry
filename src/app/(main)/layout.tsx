import { type ReactNode } from "react";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import { redirect } from "next/navigation";
import { Paths } from "@/lib/constants";
import { api } from "@/trpc/server";
import { lucia } from "@/lib/actions/auth";
import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const { user, session } = await validateRequest();
  if (!user) redirect(Paths.Login);
  if (user && !session.isUserVerified) redirect(Paths.VerifyEmail);
  const organizations = await api.user.getOrganizations.query();
  if (organizations?.length === 0) {
    await db.update(sessions).set({ organization: null }).where(eq(sessions.id, session.id));
    await lucia.validateSession(session.id);
  }
  return (
    <>
      {organizations && organizations?.length > 0 ? (
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
