"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ghost, PlusCircleIcon, RefreshCcw, SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import CycleCard from "./_components/CycleCard";
import { api } from "@/trpc/react";
import AddDialog from "./_components/AddCycle";
import useFarmerDataStore from "../../stores/farmerStore";
import { CyclesData } from "@/app/(main)/_types";
import useCycleDataStore from "../../stores/cycleStore";
import AddCycle from "./_components/AddCycle";

const Cycles = ({ cycles: serverCycle }: { cycles: CyclesData[] }) => {
  const { data: cycles, setData: setCycles } = useCycleDataStore();
  const [localCycles, setLocalCycles] = useState<CyclesData[]>(serverCycle);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const { data: farmersData } = useFarmerDataStore();
  const {
    data: newData,
    refetch,
    isRefetching,
  } = api.user.getCycles.useQuery(undefined, {
    initialData: cycles,
    refetchOnWindowFocus: false,
    refetchInterval: 50 * 60 * 1000,
    refetchOnMount: false,
  });
  useEffect(() => {
    if (newData) {
      setLocalCycles(newData);
      setCycles(newData);
    }
  }, [newData]);

  useEffect(() => {
    setLocalCycles(cycles);
  }, [cycles]);
  useEffect(() => {
    setCycles(serverCycle);
  }, [serverCycle]);
  const filteredCycles = localCycles.filter((cycle) =>
    cycle.farmerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-8">
      <div className="gap-y-4 self-start">
        <h1 className="self-start text-3xl font-bold">Cycles</h1>
        <p>You can check your cycle list here.</p>
      </div>
      <div className="flex h-auto w-full items-center justify-between rounded-md border-2 border-primary/20">
        <div className="flex py-2">
          <SearchIcon className="m-2 mb-0 " />
          <Input
            className="rounded-none border-0 border-b-2 p-2 focus-visible:outline-none focus-visible:ring-0"
            placeholder="Search cycle"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearch(true);
              if (e.target.value === "") {
                setIsSearch(false);
              }
            }}
          />
        </div>{" "}
        <div className="flex items-center gap-x-4">
          <Button
            variant={"link"}
            onClick={async () => {
              const data = await refetch();
            }}
          >
            {" "}
            <RefreshCcw size={18} className={`${isRefetching ? "animate-spin" : ""}`} />
          </Button>
          <AddDialog />
        </div>
      </div>
      {filteredCycles?.length ? (
        <div className="h-auto w-full rounded-md bg-gradient-to-r from-[#3d3069] via-red-500 to-[#3f4b6d] p-1">
          <div className="scroll-style grid h-auto max-h-[25rem] w-full grid-cols-1 gap-x-4 gap-y-4 overflow-y-auto border-0 bg-card p-2 pb-4 sm:grid-cols-2 xl:grid-cols-3 ">
            {filteredCycles.map((data) => {
              return <CycleCard cycle={data} key={data.id} />;
            })}
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          <div className="my-8 flex w-full flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="text-xl font-semibold">Pretty empty around here...</h3>
            {!isSearch && (
              <div className="flex  w-full flex-col items-center justify-center">
                <div className="flex w-full items-center justify-center gap-x-2">
                  Let&apos;s{" "}
                  <span className="max-w-32">
                    <AddCycle />
                  </span>{" "}
                  and add to your organization.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cycles;
