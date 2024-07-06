"use client";
import useCycleDataStore from "@/app/(main)/dashboard/stores/cycleStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const SingleCycle = () => {
  const { id } = useParams();
  const cycle = useCycleDataStore.getState().getItem(id?.toString() ?? "");

  return (
    <div className="h-full w-full">
      {cycle ? (
        <div>{cycle.farmerName}</div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-8">
          No Cycle found for ID : {id}
          <Button variant={"outlineLink"}>
            <Link href={"/dashboard/cycles"}>Go Back</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SingleCycle;
