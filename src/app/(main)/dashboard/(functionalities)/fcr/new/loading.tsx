import { Loader2 } from "lucide-react";
import React from "react";
import { BillingSkeleton } from "../../billing/_components/billing-skeleton";

const loading = () => {
  return <BillingSkeleton />;
};

export default loading;
