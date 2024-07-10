import { api } from "@/trpc/server";
import { DataTable } from "./_components/DataTable/Table/DataTable";
const StandardsTable = async () => {
  const isOwner = await api.user.isOwner.query();
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <DataTable isOwner={isOwner ?? false} />
    </div>
  );
};

export default StandardsTable;
