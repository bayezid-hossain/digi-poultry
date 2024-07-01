import { api } from "@/trpc/server";
import { DataTable } from "./_components/DataTable/Table/DataTable";
import { StandardData } from "@/app/(main)/_types";
const StandardsTable = async () => {
  const data: StandardData[] = await api.user.getFcrStandards.query();

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <DataTable initialData={data} />
    </div>
  );
};

export default StandardsTable;
