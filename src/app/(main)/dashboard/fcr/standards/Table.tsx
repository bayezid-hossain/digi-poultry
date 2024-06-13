import { api } from "@/trpc/server";
import { DataTable } from "./_components/DataTable";
import { StandardData } from "./_components/columns";
const StandardsTable = async () => {
  const data: StandardData[] = await api.user.getFcrStandards.query();
  console.log(data);
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <DataTable initialData={data} />
    </div>
  );
};

export default StandardsTable;
