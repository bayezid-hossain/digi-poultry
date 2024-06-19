import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { env } from "@/env";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import { Loader2 } from "lucide-react";
import Organizations from "./_components/Organizations";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Billing",
  description: "Manage your billing and subscription",
};

export default async function BillingPage() {
  const { user, session } = await validateRequest();

  if (!user) {
    redirect("/login");
  }
  const organization = await api.user.getOrganizations.query();
  return (
    <div className="grid h-full w-full place-items-start gap-8">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings</p>
      </div>
      {session.organization && (
        <div>
          <p>Your Organizations</p>
          <Organizations organizations={organization} />
        </div>
      )}
    </div>
  );
}
