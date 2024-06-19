import React from "react";
import StandardsTable from "./Table";
import { api } from "@/trpc/server";
import { validateRequest } from "@/lib/actions/auth/validate-request";

const Page = async () => {
  const { session } = await validateRequest();

  return (
    <div className="flex flex-col items-center justify-center">
      <StandardsTable />
    </div>
  );
};

export default Page;
