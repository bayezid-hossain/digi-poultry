import Link from "next/link";
import { type Metadata } from "next";
import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { CopyToClipboard } from "./_components/copy-to-clipboard";
import {
  Drizzle,
  LuciaAuth,
  NextjsLight,
  NextjsDark,
  ReactJs,
  ShadcnUi,
  TRPC,
  TailwindCss,
  ReactEmail,
} from "./_components/feature-icons";
import CardSpotlight from "./_components/hover-card";
import { Router } from "next/router";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Digital Poultry Solutions",
  description: "Solve all your needs and calculation here",
};

const Page = async () => {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);
  redirect("/dashboard/fcr");
  return <div></div>;
};
export default Page;
