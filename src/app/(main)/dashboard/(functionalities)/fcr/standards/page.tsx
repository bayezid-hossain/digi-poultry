import React from "react";
import StandardsTable from "./StandardsTable";
import { api } from "@/trpc/server";
import { validateRequest } from "@/lib/actions/auth/validate-request";

const Page = async () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <StandardsTable />
    </div>
  );
};

export default Page;
