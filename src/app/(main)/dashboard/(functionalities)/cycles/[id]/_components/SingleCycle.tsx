"use client";
import { CyclesData, FCRRecord, feed } from "@/app/(main)/_types";
import InvitePopup from "@/app/(main)/dashboard/_components/InvitePopup";
import useCycleDataStore from "@/app/(main)/dashboard/stores/cycleStore";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Paths } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import { api } from "@/trpc/react";
import { isError } from "@tanstack/react-query";
import { Ghost, RefreshCcw, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BillingSkeleton } from "../../../billing/_components/billing-skeleton";
import useUserDataStore from "@/app/(main)/dashboard/stores/userStore";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CloseCyclePopup from "./CloseCyclePopup";

const SingleCycle = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState<string>("");
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
  const filteredFCR = fcrs.filter((fcr) => {
    return (
      fcr.avgWeight?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      fcr.age?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      fcr.totalMortality?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      fcr.fcr?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(fcr.createdAt ?? "", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        weekday: "long",
      })
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });
  return (
    <div className="h-full w-full">
      {cycle ? (
        <div className="flex h-full w-full flex-col items-start justify-start gap-y-4">
          <div className="flex flex-col gap-y-2">
            <p className="text-3xl">{cycle.farmerName}</p>{" "}
            <p className="text-xl">{cycle.farmerLocation}</p>
          </div>
          <hr className="w-full bg-primary-foreground" />
          {userId === cycle.createdBy.id && !cycle.ended && !cycle.endDate ? (
            <div className="absolute  right-0 flex gap-x-4 px-2">
              <div className="-mt-3">
                <InvitePopup cycleId={cycleId} />
              </div>
              <CloseCyclePopup id={cycleId} />
            </div>
          ) : null}
          <div className="flex w-full items-center justify-between">
            <div className="flex py-2">
              <SearchIcon className="m-2 mb-0 " />
              <Input
                className="rounded-none border-0 border-b-2 p-2 focus-visible:outline-none focus-visible:ring-0"
                placeholder="Search FCR"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
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
                <RefreshCcw
                  aria-label="refresh table"
                  size={18}
                  className={`${isRefetching ? "animate-spin" : ""}`}
                />
              </Button>{" "}
              {userId === cycle.createdBy.id && !cycle.ended && !cycle.endDate ? (
                <SubmitButton variant={"outlineLink"}>
                  {" "}
                  <Link href={`${Paths.NewFCR}?cycleId=${cycleId ?? ""}`}>Calculate FCR Now!</Link>
                </SubmitButton>
              ) : null}
            </div>
          </div>
          {searchTerm !== "" ? (
            <CardDescription className="h-4 pl-2">
              Results Found: {filteredFCR.length}
            </CardDescription>
          ) : (
            <div className="h-4"></div>
          )}
          {isLoading ? (
            <section className="flex h-full w-full flex-col items-center justify-center gap-y-8">
              <BillingSkeleton />
            </section>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="pb-4 text-xl underline underline-offset-4">Recent FCRs:</p>
              {filteredFCR && filteredFCR?.length > 0 ? (
                <div
                  className={`scroll-style flex h-auto w-full max-w-screen-xl gap-x-4 gap-y-4 overflow-x-auto border-2 bg-card p-2 pb-4 `}
                >
                  {filteredFCR?.map((fcr) => {
                    let totalFeed = 1;
                    fcr.totalFeed.map((feed) => {
                      totalFeed += feed.quantity;
                    });

                    return (
                      <Card className="w-full min-w-[400px] max-w-fit">
                        <CardHeader className="gap-y-4 text-2xl">
                          {formatDate(fcr.createdAt ?? "", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            weekday: "long",
                          })}
                          <hr />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-y-4">
                          <div className="flex w-fit flex-col items-center justify-center rounded-full border-2 px-5 py-2">
                            <p className="text-xs">Day</p>
                            <p className="text-2xl">{fcr.age}</p>
                          </div>
                          <Table className="flex flex-col">
                            <TableCaption className="mb-4 text-left text-xl ">
                              Standard and Current Values
                            </TableCaption>
                            <TableHeader className="w-full border-2 border-b-0">
                              <TableRow className="flex justify-around">
                                <TableHead className="flex h-14 w-full items-center justify-center font-bold text-primary">
                                  Standard
                                </TableHead>
                                <TableHead className="flex h-14 w-full items-center justify-center font-bold text-primary">
                                  Current
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="border-2 border-t-0">
                              <TableRow className="flex w-full justify-around">
                                <TableCell className="flex w-full items-center justify-center border-r-2 font-medium">
                                  <div className="flex w-full justify-center gap-x-1">
                                    <p>FCR should be </p>
                                    <p className="font-bold underline underline-offset-4">
                                      {fcr.stdFcr.toString()}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="flex w-full items-center justify-center font-medium">
                                  <div className="flex w-full justify-center gap-x-1">
                                    {" "}
                                    <p>FCR is </p>
                                    <p
                                      className={`font-bold underline underline-offset-4 ${fcr.fcr > fcr.stdFcr ? "text-red-600" : "text-green-600"}`}
                                    >
                                      {fcr.fcr.toString()}
                                    </p>
                                  </div>
                                </TableCell>
                              </TableRow>{" "}
                              <TableRow className="flex w-full justify-evenly">
                                <TableCell className="flex w-full items-center justify-center border-r-2 font-medium">
                                  <div className="flex w-full justify-center gap-x-1">
                                    <p>Wt should be </p>
                                    <p className="font-bold underline underline-offset-4">
                                      {fcr.stdWeight.toString()} gm
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="flex w-full items-center justify-center font-medium">
                                  <div className="flex w-full justify-center gap-x-1">
                                    {" "}
                                    <p>Wt is </p>
                                    <p
                                      className={`font-bold underline underline-offset-4 ${fcr.stdWeight > fcr.avgWeight ? "text-red-600" : "text-green-600"}`}
                                    >
                                      {fcr.avgWeight.toString()} gm
                                    </p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>

                          <Table className="flex flex-col">
                            <TableCaption className="mb-4 text-left text-xl ">
                              Total Feed And Stock Information
                              <p className="mt-2 text-sm font-bold text-secondary-foreground">
                                {totalFeed} {totalFeed > 1 ? "Bags" : "Bag"} running
                              </p>
                            </TableCaption>
                            <TableHeader className="w-full border-2 border-b-0">
                              <TableRow className="flex justify-around">
                                <TableHead className="flex h-14 w-full items-center justify-center font-bold text-primary">
                                  Total Feed (bags)
                                </TableHead>
                                <TableHead className="flex h-14 w-full items-center justify-center font-bold text-primary">
                                  Farm Stock (bags)
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="border-2 border-t-0">
                              <TableRow className="flex w-full justify-around">
                                <TableCell className="flex w-full items-center justify-center border-r-2 font-medium">
                                  {fcr.totalFeed[0]?.name}
                                </TableCell>
                                <TableCell className="flex  w-full  items-center justify-center border-r-2 font-medium">
                                  {fcr.totalFeed[1]?.name}
                                </TableCell>{" "}
                                <TableCell className="flex  w-full  items-center justify-center border-r-2 font-medium">
                                  {fcr.totalFeed[0]?.name}
                                </TableCell>{" "}
                                <TableCell className="flex w-full items-center justify-center font-medium">
                                  {fcr.totalFeed[1]?.name}
                                </TableCell>
                              </TableRow>{" "}
                              <TableRow className="flex w-full justify-evenly">
                                <TableCell className="flex w-full items-center justify-center font-medium">
                                  {fcr.totalFeed[0]?.quantity}
                                </TableCell>{" "}
                                <TableCell className="flex w-full items-center justify-center border-r-2 font-medium">
                                  {fcr.totalFeed[1]?.quantity}
                                </TableCell>{" "}
                                <TableCell className="flex w-full items-center justify-center font-medium">
                                  {fcr.farmStock[0]?.quantity}
                                </TableCell>{" "}
                                <TableCell className="flex w-full items-center justify-center font-medium">
                                  {fcr.farmStock[1]?.quantity}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>

                          <CardDescription>Disease: {fcr.disease}</CardDescription>
                          <CardDescription>Medicine: {fcr.medicine}</CardDescription>
                        </CardContent>
                      </Card>
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
                        {userId === cycle.createdBy.id && !cycle.ended && !cycle.endDate ? (
                          <SubmitButton variant={"link"} className=" border-[1px] p-2 outline-none">
                            <Link href={`${Paths.NewFCR}?cycleId=${cycleId ?? ""}`}>
                              Let's Calculate FCR Now!
                            </Link>
                          </SubmitButton>
                        ) : (
                          <div>Ask your cycle creator to add some FCR!</div>
                        )}
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

const PAndSpan = ({
  pValue,
  spanValue,
  spanClass,
  pClass,
}: {
  pValue: string;
  spanValue: string;
  spanClass?: string;
  pClass?: string;
}) => {
  return (
    <p className={cn(pClass, "font-normal")}>
      {pValue}{" "}
      <span className={cn("font-semibold  underline-offset-4", spanClass)}>{spanValue}</span>
    </p>
  );
};
