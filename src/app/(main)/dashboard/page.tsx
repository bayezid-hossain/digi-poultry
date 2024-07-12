import { env } from "@/env";
import { Paths } from "@/lib/constants";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Daily FCR",
  description: "Manage your DailyFCR here",
};

const Page = async () => {
  redirect(Paths.FCR);
};
export default Page;
