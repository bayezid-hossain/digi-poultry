import React from "react";
import Cycles from "./Cycles";
import { api } from "@/trpc/server";

const page = async () => {
  const cycles = await api.user.getCycles.query();

  return (
    <div>
      <Cycles cycles={cycles ?? []} />
    </div>
  );
};

export default page;
