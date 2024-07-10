import React from "react";
import FCR from "./newFCR";
import { api } from "@/trpc/server";

const Page = async () => {
  const standards = await api.user.getFcrStandards.query();
  return (
    <div className="flex h-full max-h-svh w-full items-center justify-center ">
      <FCR />
    </div>
  );
};

export default Page;
