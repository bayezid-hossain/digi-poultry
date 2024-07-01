"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ghost, PlusCircleIcon, RefreshCcw, SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import FarmerCard from "./_components/FarmerCard";
import { api } from "@/trpc/react";
import AddDialog from "./_components/AddFarmer";
type FarmerData = {
  name: string;
  location: string;
  id: string;
};
const Farmers = ({ farmers }: { farmers: FarmerData[] }) => {
  const [localFarmers, setLocalFarmers] = useState<FarmerData[]>(farmers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const {
    data: newData,
    refetch,
    isRefetching,
  } = api.user.getFarmers.useQuery(undefined, {
    initialData: farmers,
    refetchOnWindowFocus: false,
    refetchInterval: 50 * 60 * 1000,
    refetchOnMount: false,
  });
  useEffect(() => {
    newData && setLocalFarmers(newData);
  }, [newData]);
  useEffect(() => {
    setLocalFarmers(farmers);
  }, [farmers]);
  const filteredFarmers = localFarmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-8">
      <div className="gap-y-4 self-start">
        <h1 className="self-start text-3xl font-bold">Farmers</h1>
        <p>You can check your farmer list here.</p>
      </div>
      <div className="flex h-auto w-full items-center justify-between rounded-md border-2 border-primary/20">
        <div className="flex py-2">
          <SearchIcon className="m-2 mb-0 " />
          <Input
            className="rounded-none border-0 border-b-2 p-2 focus-visible:outline-none focus-visible:ring-0"
            placeholder="Search farmer"
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
          <AddDialog refetch={refetch} />
        </div>
      </div>
      {filteredFarmers?.length ? (
        <div className="h-auto w-full rounded-md bg-gradient-to-r from-[#3d3069] via-red-500 to-[#3f4b6d] p-1">
          <div className="scroll-style grid h-auto max-h-[70vh] w-full grid-cols-2 overflow-y-auto border-0 bg-card md:max-h-[60vh] md:grid-cols-3 ">
            {filteredFarmers.map((data) => {
              return (
                <FarmerCard
                  key={data.id}
                  id={data.id}
                  location={data.location}
                  name={data.name}
                  refetch={refetch}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          <div className="my-8 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="text-xl font-semibold">Pretty empty around here...</h3>
            {!isSearch && (
              <div className="flex w-full flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-x-2">
                  Let&apos;s <AddDialog refetch={refetch} /> and add to your organization.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Farmers;
