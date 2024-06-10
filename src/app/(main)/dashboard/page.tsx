import { redirect } from "next/navigation";
import { env } from "@/env";
import { api } from "@/trpc/server";
import { type Metadata } from "next";
import * as React from "react";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  redirect("/dashboard/fcr");
  return <div></div>;
};
export default Page;
