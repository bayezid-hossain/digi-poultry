import { Loader2 } from "lucide-react";
import React from "react";
import { BillingSkeleton } from "../../billing/_components/billing-skeleton";

const loading = () => {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-y-8">
      <BillingSkeleton />
    </section>
  );
};

export default loading;
