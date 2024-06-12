"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
import React from "react";
import AddDialog from "./AddDialog";
import { DataTablePagination } from "./DataTablePagination";
import { StandardData } from "./columns";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: StandardData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const {
    data: newData,
    refetch,
    isRefetching,
  } = api.user.getFcrStandards.useQuery(undefined, {
    initialData: data,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
  });
  const table = useReactTable({
    data: newData as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      {" "}
      <div className="flex flex-row items-center justify-start pb-4">
        <Input
          placeholder="Search by Age"
          value={(table.getColumn("age")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("age")?.setFilterValue(event.target.value)}
          className="mr-4 max-w-sm px-2"
        />
        <Button
          variant={"link"}
          onClick={() => {
            refetch();
          }}
        >
          {" "}
          <RefreshCcw size={18} className={`${isRefetching ? "animate-spin" : ""}`} />
        </Button>
        <AddDialog
          newRequest={true}
          refetch={refetch}
          defaultAge={(newData.length + 1).toString()}
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
        <div className="flex flex-col gap-2.5 py-2">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
