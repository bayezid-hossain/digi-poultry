import React from "react";
import FCR from "./newFCR";
import { api } from "@/trpc/server";

const Page = async () => {
  const standards = await api.user.getFcrStandards.query();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <FCR standardData={standards} />
    </div>
  );
};

export default Page;
