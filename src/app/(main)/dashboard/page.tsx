import { redirect } from "next/navigation";
import { env } from "@/env";
import { api } from "@/trpc/server";
import { type Metadata } from "next";
import * as React from "react";
import { validateRequest } from "@/lib/actions/auth/validate-request";
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
  const { user, session } = await validateRequest();
  if (!user) redirect(Paths.Login);

  if (session.organization) redirect("/dashboard/fcr");
  return <div></div>;
};
export default Page;
