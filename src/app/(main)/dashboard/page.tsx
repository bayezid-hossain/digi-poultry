import { env } from "@/env";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Daily FCR",
  description: "Manage your DailyFCR here",
};

const Page = async () => {
  redirect("/dashboard/fcr");
};
export default Page;
