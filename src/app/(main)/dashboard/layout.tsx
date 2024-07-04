import { validateRequest } from "@/lib/actions/auth/validate-request";
import { DashboardNav } from "./_components/dashboard-nav";
import { OrganizationWarning } from "./_components/organization-warning";
import { redirect } from "next/navigation";
import { Paths } from "@/lib/constants";
import { api } from "@/trpc/server";

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const { user, session } = await validateRequest();
  const data = await api.user.getFcrStandards.query();
  const farmers = await api.user.getFarmers.query();
  const cycles = await api.user.getCycles.query();
  if (!user) redirect(Paths.Login);
  return (
    <div className=" container min-h-[calc(100vh-180px)] overflow-y-hidden px-2 pt-6 sm:px-4 md:px-10">
      <div className="flex flex-col gap-6 md:flex-row lg:gap-10">
        <DashboardNav
          organization={session?.organization}
          standards={data}
          farmers={farmers ?? []}
          cycles={cycles ?? []}
          className="flex flex-shrink-0 gap-4 md:w-48 md:flex-col lg:w-80"
        />
        <main className="w-full space-y-4">
          {!session?.organization ? <OrganizationWarning /> : null}
          <div className="h-full w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
