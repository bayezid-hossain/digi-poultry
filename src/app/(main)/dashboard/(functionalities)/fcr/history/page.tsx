import React from "react";
import History from "./History";
import { api } from "@/trpc/server";

const Page = async () => {
  const data = await api.user.getFCRHistory.query();
  console.log(data);
  return (
    <div>
      <History />
    </div>
  );
};

export default Page;
