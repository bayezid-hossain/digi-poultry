import { api } from "@/trpc/server";
import React from "react";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/columns";
const StandardsTable = async () => {
  const data = await api.user.getFcrStandards.query();
  console.log(data);
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default StandardsTable;
