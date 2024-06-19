import { validateRequest } from "@/lib/actions/auth/validate-request";
import React from "react";

const Page = async () => {
  const { session } = await validateRequest();
  return <div>{session?.organization}</div>;
};

export default Page;
