import { validateRequest } from "@/lib/actions/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default async function DashboardFunctionalitiesLayout({ children }: Props) {
  const { session } = await validateRequest();

  if (!session?.organization) redirect(Paths.FCR);
  return <div className="h-full w-full">{children}</div>;
}
