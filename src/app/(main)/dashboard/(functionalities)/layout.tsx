import { validateRequest } from "@/lib/actions/auth/validate-request";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default async function DashboardFunctionalitiesLayout({ children }: Props) {
  const { session } = await validateRequest();

  if (!session?.organization) redirect("/dashboard");
  return <div className="h-full w-full">{children}</div>;
}
