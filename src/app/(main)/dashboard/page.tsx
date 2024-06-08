import { redirect } from "next/navigation";
import { env } from "@/env";
import { api } from "@/trpc/server";
import { type Metadata } from "next";
import * as React from "react";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Daily FCR",
  description: "Manage your DailyFCR here",
};

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

const Page = async ({ searchParams }: Props) => {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold md:text-4xl">Daily FCR</h1>
        <p className="text-sm text-muted-foreground">Manage your FCRs here</p>
      </div>
    </div>
  );
};
export default Page;
