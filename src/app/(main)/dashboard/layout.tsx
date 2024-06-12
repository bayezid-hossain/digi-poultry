import { DashboardNav } from "./_components/dashboard-nav";
import { VerificiationWarning } from "./_components/verificiation-warning";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="container min-h-[calc(100vh-180px)] px-2 pt-6 sm:px-4 md:px-10">
      <div className="flex flex-col gap-6 md:flex-row lg:gap-10">
        <DashboardNav className="flex flex-shrink-0 gap-4 md:w-48 md:flex-col lg:w-80" />
        <main className="w-full space-y-4">
          <VerificiationWarning />
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
