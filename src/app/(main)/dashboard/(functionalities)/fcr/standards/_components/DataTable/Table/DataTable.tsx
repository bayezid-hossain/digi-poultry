"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { Ghost, RefreshCcw } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import AddDialog from "../../AddDialog";
import { DataTablePagination } from "./DataTablePagination";
import { columns } from "./columns";
import { SubmitButton } from "@/components/submit-button";
import { deleteMultipleRecords, importStandardTable } from "@/lib/actions/fcr/actions";
import { useFormState, useFormStatus } from "react-dom";
import MultiAddDialog from "../_MultiAddDialog/MultiAddDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { StandardData } from "@/app/(main)/_types";
import useStandardDataStore from "@/app/(main)/dashboard/stores/standardsStore";

export const DataTable = ({ isOwner }: { isOwner: boolean }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [ages, setAges] = useState<number[]>([0]);
  const {
    setData: setStandardsInStore,
    data: standardsData,
    removeData,
    isFetching,
  } = useStandardDataStore();
  const [data, setData] = useState<StandardData[]>(standardsData);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [hideColumns, setHideColumns] = useState<boolean>(!isOwner);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); //manage your own row selection state
  const [state, formAction] = useFormState(deleteMultipleRecords, null);
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [importState, importStandardAction] = useFormState(importStandardTable, null);
  const {
    data: newData,
    refetch,
    isRefetching,
    isSuccess,
  } = api.user.getFcrStandards.useQuery(undefined, {
    initialData: standardsData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 50 * 60 * 1000,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (!isFetching) setLoading(false);
  }, [isFetching]);
  useEffect(() => {
    setData(standardsData);
  }, [standardsData]);
  const table = useReactTable({
    data: data,
    columns: columns(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,

    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  useEffect(() => {
    if (hideColumns) {
      table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => {
          column.toggleVisibility(false);
        });
    }
  }, [hideColumns]);
  useEffect(() => {
    if (importState?.success) {
      if (data.length < 1)
        setStandardsInStore(
          JSON.parse(
            importState?.success?.toString() ? importState?.success?.toString() : "[]",
          ) as StandardData[],
        );
    }
  }, [importState?.success]);
  useEffect(() => {
    const ages: number[] = [];
    table.getFilteredSelectedRowModel().rows.map((row) => {
      ages.push(row.original.age);
    });
    setAges(ages);
    setOpen(false);
  }, [table.getFilteredSelectedRowModel().rows.length]);

  return (
    <div className="max-w-7xl">
      <div className="flex w-full flex-row items-center justify-start pb-4">
        <Input
          placeholder="Search by Age"
          value={(table.getColumn("age")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("age")?.setFilterValue(event.target.value)}
          className="mr-4 max-w-md px-2"
        />
        <Button
          variant={"link"}
          onClick={async () => {
            const data = await refetch();
            if (data.data) {
              setData(data.data);
            }
          }}
        >
          {" "}
          <RefreshCcw
            aria-label="refresh table"
            size={18}
            className={`${isRefetching ? "animate-spin" : ""}`}
          />
        </Button>
        {isOwner ? (
          <AddDialog
            newRequest={true}
            refetch={async () => {
              const data = await refetch();
              if (data.data) {
                setData(data.data);
              }
            }}
            defaultAge={(data ? data.length + 1 : 1).toString()}
            defaultFcr="1.3"
            defaultWeight="900"
          />
        ) : null}
      </div>{" "}
      <div className="rounded-md  border">
        <Table className="scroll-style max-h-[50vh]  overflow-y-auto ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {isRefetching ? (
            <TableRow>
              <TableCell colSpan={columns.length + 4} className="h-24 text-center">
                <div className="my-8 flex flex-col items-center gap-8">
                  <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                    <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                    <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                  </div>{" "}
                  <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                    <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                    <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                  </div>{" "}
                  <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                    <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                    <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                  </div>{" "}
                  <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                    <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                    <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                  </div>{" "}
                  <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                    <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                    <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                  </div>{" "}
                  <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                    <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                    <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                  </div>{" "}
                  <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                    <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                    <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                  </div>{" "}
                  <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                    <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                    <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <TableBody className="">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="w-full"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="w-full" key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  {loading ? (
                    <TableCell colSpan={columns.length + 4} className="h-24 text-center">
                      <div className="my-8 flex flex-col items-center gap-8">
                        <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                          <Skeleton className="h-4 w-6" />
                          <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                          <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                          <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                        </div>{" "}
                        <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                          <Skeleton className="h-4 w-6" />
                          <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                          <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                          <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                        </div>{" "}
                        <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                          <Skeleton className="h-4 w-6" />
                          <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                          <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                          <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                        </div>{" "}
                        <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                          <Skeleton className="h-4 w-6" />
                          <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                          <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                          <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                        </div>{" "}
                        <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                          <Skeleton className="h-4 w-6" />
                          <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                          <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                          <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                        </div>{" "}
                        <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                          <Skeleton className="h-4 w-6" />
                          <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                          <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                          <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                        </div>{" "}
                        <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                          <Skeleton className="h-4 w-6" />
                          <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                          <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                          <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                        </div>{" "}
                        <div className="flex w-full items-start justify-start gap-x-10 px-2 ">
                          <Skeleton className="h-4 w-6" />
                          <Skeleton className=" -ml-4 h-4 w-10 md:-ml-3 lg:ml-0 lg:w-14" />
                          <Skeleton className="ml-4 h-4 w-16 sm:ml-16 md:ml-12 lg:ml-16" />
                          <Skeleton className="ml-8 h-4 w-16 sm:ml-16 md:ml-24  lg:ml-28" />
                        </div>
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell colSpan={columns.length + 4} className="h-24 text-center">
                      <div className="my-8 flex flex-col items-center gap-2">
                        <Ghost className="h-8 w-8 text-zinc-800" />
                        <h3 className="text-xl font-semibold">Pretty empty around here...</h3>
                        {isOwner ? (
                          <div>
                            <p>Let&apos;s create your first standard data.</p>
                            <p className="text-xs font-semibold">Or</p>
                            <form action={importStandardAction}>
                              {" "}
                              <SubmitButton> Import our standard values!</SubmitButton>
                            </form>
                          </div>
                        ) : (
                          <p>Ask your organization admin to import or create Standard Data</p>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>{" "}
        <div className="flex flex-col gap-2.5 p-4">
          <DataTablePagination table={table} />
        </div>
        {isOwner ? (
          <div className="m-2 flex flex-col gap-y-4">
            <div>
              <MultiAddDialog
                refetch={async () => {
                  const data = await refetch();
                  if (data.data) {
                    setData(data.data);
                  }
                }}
              />
            </div>
            <Dialog modal open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild className="w-fit">
                <Button variant={"destructive"}>Delete Selected Rows</Button>
              </DialogTrigger>{" "}
              <DialogContent className="mb-auto sm:max-w-[425px] ">
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete?</DialogTitle>
                  <DialogDescription>
                    Please confirm that you want to delete this information, it cannot be recovered
                    once deleted!
                  </DialogDescription>
                </DialogHeader>
                <div className="">
                  <form
                    ref={ref}
                    action={formAction}
                    className="flex flex-row justify-center gap-x-8"
                    onSubmit={() => {
                      setRowSelection({});

                      {
                        ages.map((age) => {
                          removeData(age);
                        });
                      }
                    }}
                  >
                    <Input
                      name="ages"
                      className="hidden"
                      defaultValue={ages?.toString()}
                      required
                    />

                    <DialogClose className="flex flex-row items-center justify-center rounded-md bg-primary px-2 font-semibold text-primary-foreground hover:text-white">
                      No
                    </DialogClose>
                    <SubmitButton className="m-0 bg-destructive text-destructive-foreground">
                      Yes
                    </SubmitButton>
                  </form>
                </div>
              </DialogContent>
            </Dialog>{" "}
          </div>
        ) : null}
      </div>
    </div>
  );
};
