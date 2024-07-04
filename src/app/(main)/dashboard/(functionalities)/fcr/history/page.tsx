import React from "react";
import History from "./History";
import { api } from "@/trpc/server";

const Page = async () => {
  const data = await api.user.getFCRHistory.query();
  return (
    <div>
      <History />
    </div>
  );
};

export default Page;
