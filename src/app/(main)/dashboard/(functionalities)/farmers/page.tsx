import React from "react";
import Farmers from "./Farmers";
import { api } from "@/trpc/server";

const page = async () => {
  const farmers = await api.user.getFarmers.query();
  return (
    <div>
      <Farmers serverFarmers={farmers ?? []} />
    </div>
  );
};

export default page;
