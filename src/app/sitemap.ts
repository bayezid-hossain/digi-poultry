import { type MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils";
import { Paths } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    Paths.Billing,
    Paths.CompanyBilling,
    Paths.Cycles,
    Paths.FCR,
    Paths.VerifyEmail,
    Paths.Standards,
    Paths.Signup,
    Paths.Settings,
    Paths.ResetPassword,
    Paths.FarmerBilling,
    Paths.Farmers,
    Paths.History,
    Paths.Login,
    Paths.NewFCR,
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
