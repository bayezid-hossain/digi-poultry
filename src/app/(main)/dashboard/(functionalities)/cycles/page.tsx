import React from "react";
import Cycles from "./Cycles";
import { api } from "@/trpc/server";
import { validateRequest } from "@/lib/actions/auth/validate-request";

const page = async () => {
  const { user, session } = await validateRequest();
  const cycles = await api.user.getCycles.query();

  return (
    <div>
      <Cycles cycles={cycles ?? []} />
    </div>
  );
};

export default page;
