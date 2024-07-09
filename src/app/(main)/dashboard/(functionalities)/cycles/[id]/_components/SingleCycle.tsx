"use client";
import { CyclesData, FCRRecord, feed } from "@/app/(main)/_types";
import InvitePopup from "@/app/(main)/dashboard/_components/InvitePopup";
import useCycleDataStore from "@/app/(main)/dashboard/stores/cycleStore";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Paths } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { api } from "@/trpc/react";
import { isError } from "@tanstack/react-query";
import { Ghost, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BillingSkeleton } from "../../../billing/_components/billing-skeleton";
import useUserDataStore from "@/app/(main)/dashboard/stores/userStore";

const SingleCycle = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const { data: userId } = useUserDataStore();
  const { data, isLoading, isRefetching, refetch } = api.user.getFCRHistory.useQuery(
    {
      cycleId: id?.toString() ?? undefined,
    },
    { refetchOnMount: true, refetchOnWindowFocus: false },
  );
  const { getItem, isFetching } = useCycleDataStore();
  const cycle = getItem(id?.toString() ?? "");
  const cycleId = Array.isArray(id) ? id[0] : id ?? "";

  const [fcrs, setFcrs] = useState<FCRRecord[]>([]);
  useEffect(() => {
    if (data) {
      setFcrs(data);
    }
  }, [data]);
  return (
    <div className="h-full w-full">
      {cycle ? (
        <div className="flex h-full w-full flex-col items-start justify-start gap-y-4">
          <div className="flex flex-col gap-y-2">
            <p className="text-3xl">{cycle.farmerName}</p>{" "}
            <p className="text-xl">{cycle.farmerLocation}</p>
          </div>
          {userId === cycle.createdBy.id ? (
            <div className="absolute  right-0 flex gap-x-4 px-2">
              <div className="-mt-3">
                <InvitePopup cycleId={cycleId} />
              </div>
              <SubmitButton variant={"destructive"}>
                <Link href={`${Paths.NewFCR}?cycleId=${cycleId ?? ""}`}>Close Cycle</Link>
              </SubmitButton>
            </div>
          ) : null}
          <div className="flex w-full items-center justify-between">
            <p className="p-1 underline underline-offset-4">Recent FCRS:</p>
            <div className="flex items-center gap-x-4">
              <Button
                variant={"link"}
                onClick={async () => {
                  const data = await refetch();
                }}
              >
                {" "}
                <RefreshCcw size={18} className={`${isRefetching ? "animate-spin" : ""}`} />
              </Button>{" "}
              <SubmitButton variant={"outlineLink"}>
                {" "}
                <Link href={`${Paths.NewFCR}?cycleId=${cycleId ?? ""}`}>Calculate FCR Now!</Link>
              </SubmitButton>{" "}
            </div>
          </div>
          {isLoading ? (
            <section className="flex h-full w-full flex-col items-center justify-center gap-y-8">
              <BillingSkeleton />
            </section>
          ) : (
            <div className="h-full w-full">
              {fcrs && fcrs?.length > 0 ? (
                <div
                  className={`scroll-style ${fcrs && fcrs?.length > 0 ? "grid" : "flex flex-row"} h-auto max-h-[600px] w-full grid-cols-1 gap-x-4 gap-y-4 overflow-y-auto border-0 bg-card p-2 pb-4 sm:grid-cols-2 xl:grid-cols-3 `}
                >
                  {fcrs?.map((fcr) => {
                    let totalFeed = 1;
                    fcr.totalFeed.map((feed) => {
                      totalFeed += feed.quantity;
                    });

                    return (
                      <div className="flex flex-col gap-y-2 rounded-md border-2 border-primary p-2">
                        <p>
                          Date -{" "}
                          {formatDate(fcr.date ?? "", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            weekday: "long",
                          })}
                        </p>

                        <hr />
                        <p>
                          Age: {fcr.age} {fcr.age > 1 ? "days" : "day"}
                        </p>
                        <div className="grid w-full grid-cols-2">
                          <p>Standard FCR: {fcr.stdFcr}</p>
                          <p>Current FCR: {fcr.fcr}</p>
                        </div>
                        <div className="grid w-full grid-cols-2">
                          <p>Standard Weight: {fcr.stdWeight} gm</p>
                          <p>Current Avg Weight: {fcr.avgWeight} gm</p>
                        </div>
                        <div className="grid w-full grid-cols-2">
                          <p>Last Day Mortality: {fcr.todayMortality}</p>
                          <p>Total Mortality: {fcr.totalMortality}</p>
                        </div>
                        <p>
                          Feed: {totalFeed} {totalFeed > 1 ? "Bags" : "Bag"} running
                        </p>

                        <div className="grid w-full grid-cols-2">
                          <p>
                            {fcr.totalFeed[0]?.name}
                            {fcr.totalFeed[0]?.quantity}
                          </p>
                          <p>
                            {fcr.totalFeed[1]?.name} : {fcr.totalFeed[1]?.quantity}
                          </p>
                        </div>
                        <p>Total Stock</p>

                        <div className="grid w-full grid-cols-2">
                          <p>
                            {fcr.farmStock[0]?.name} : {fcr.farmStock[0]?.quantity}
                          </p>
                          <p>
                            {fcr.farmStock[1]?.name} : {fcr.farmStock[1]?.quantity}
                          </p>
                        </div>
                        <div className="grid w-full grid-cols-2">
                          <p>Last Day Mortality: {fcr.todayMortality}</p>
                          <p>Total Mortality: {fcr.totalMortality}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="col-span-3 flex w-full items-center justify-center">
                  <div className="my-8 flex w-full flex-col items-center gap-2">
                    <Ghost className="h-8 w-8 text-zinc-800" />
                    <h3 className="text-xl font-semibold">Pretty empty around here...</h3>
                    <div className="flex  w-full flex-col items-center justify-center">
                      <div className="flex w-full items-center justify-center gap-x-2">
                        Let&apos;s{" "}
                        <SubmitButton variant={"link"} className=" border-[1px] p-2 outline-none">
                          <Link href={`${Paths.NewFCR}?cycleId=${cycleId ?? ""}`}>
                            Calculate FCR Now!
                          </Link>
                        </SubmitButton>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          {isLoading ? (
            <>
              <section className="flex h-full w-full flex-col items-center justify-center gap-y-8">
                <BillingSkeleton />
              </section>
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-y-8">
              No Cycle found for ID : {id}
              <Button variant={"outlineLink"}>
                <Link href={Paths.Cycles}>Go Back</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleCycle;
