"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowSelectionState,
  SortingState,
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
import AddDialog from "./AddDialog";
import { DataTablePagination } from "./DataTablePagination";
import { StandardData, columns } from "./columns";
import { SubmitButton } from "@/components/submit-button";
import { deleteMultipleRecords } from "@/lib/fcr/actions";
import { useFormState } from "react-dom";

export const DataTable = ({ initialData }: { initialData: StandardData[] }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [ages, setAges] = useState<number[]>([0]);
  const [data, setData] = useState<StandardData[]>(initialData);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); //manage your own row selection state

  const [state, formAction] = useFormState(deleteMultipleRecords, null);
  const ref = useRef<HTMLFormElement>(null);

  const {
    data: newData,
    refetch,
    isRefetching,
    isSuccess,
  } = api.user.getFcrStandards.useQuery(undefined, {
    initialData,
    refetchOnWindowFocus: false,
    refetchInterval: 50 * 60 * 1000,
    refetchOnMount: false,
  });
  const updateTable = async () => {
    const data = await refetch();
    if (data.data) {
      setData(data.data);
    }
  };
  useEffect(() => {
    setRowSelection({});
    console.log(rowSelection);
    updateTable()
      .then(() => {
        console.log("Updating table");
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [state?.success]);

  const table = useReactTable({
    data: data,
    columns: columns({
      onEdit: updateTable,
      onDelete: updateTable,
      previousData: newData,
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  useEffect(() => {
    const ages: number[] = [];
    table.getFilteredSelectedRowModel().rows.map((row) => {
      ages.push(row.original.age);
    });
    setAges(ages);
  }, [table.getFilteredSelectedRowModel().rows.length]);
  return (
    <div className="min-w-96 max-w-7xl">
      {" "}
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
          <RefreshCcw size={18} className={`${isRefetching ? "animate-spin" : ""}`} />
        </Button>
        <AddDialog
          newRequest={true}
          refetch={async () => {
            const data = await refetch();
            if (data.data) {
              setData(data.data);
            }
          }}
          defaultAge={(newData ? newData.length + 1 : 1).toString()}
          defaultFcr="1.3"
          defaultWeight="900"
        />
      </div>{" "}
      <div className="rounded-md border">
        <Table>
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
          <TableBody>
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
                <TableCell colSpan={columns.length + 3} className="h-24 text-center">
                  <div className="my-8 flex flex-col items-center gap-2">
                    <Ghost className="h-8 w-8 text-zinc-800" />
                    <h3 className="text-xl font-semibold">Pretty empty around here...</h3>
                    <p>Let&apos;s create your first standard data.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>{" "}
        <div className="flex flex-col gap-2.5 p-4">
          <DataTablePagination table={table} />
        </div>
        <div className="m-2 flex flex-col gap-y-4">
          <div>
            <Button variant={"outlineLink"}>Add Multiple Entries</Button>
          </div>
          <form ref={ref} action={formAction}>
            <Input name="ages" className="hidden" value={ages?.toString()} required />
            <SubmitButton variant={"destructive"}>Delete Selected Rows</SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
};
