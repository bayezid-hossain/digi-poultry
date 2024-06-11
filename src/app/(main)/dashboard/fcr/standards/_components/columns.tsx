"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
export type StandardData = {
  age: number;
  stdFcr: number;
  stdWeight: number;
};

export const columns: ColumnDef<StandardData>[] = [
  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full px-1 text-center sm:px-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // const amount = parseFloat(row.getValue("amount"));
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // }).format(amount);

      return <div className="text-center font-medium">{row.getValue("age")}</div>;
    },
    enableColumnFilter: true,
    filterFn: (row, id, value: string) => {
      console.log(value);
      console.log(row.getValue(id));
      return value == row.getValue(id) || row.getValue(id)?.toString().includes(value)
        ? true
        : false;
    },
  },
  {
    accessorKey: "stdWeight",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full px-1 text-center sm:px-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="hidden sm:flex">Standard Weight</p>
          <p className="flex sm:hidden">Std Wt</p>
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // const amount = parseFloat(row.getValue("amount"));
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // }).format(amount);

      return <div className="text-center font-medium">{row.getValue("stdWeight")}</div>;
    },
    enableColumnFilter: false,
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "stdFcr",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full px-1 text-center sm:px-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="hidden sm:flex">Standard FCR</p>
          <p className="flex sm:hidden">Std FCR</p>
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // const amount = parseFloat(row.getValue("amount"));
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // }).format(amount);

      return <div className="text-center font-medium">{row.getValue("stdFcr")}</div>;
    },
    enableColumnFilter: false,
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const standard = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="mt-2.5">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(standard.stdFcr.toString())}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(standard.stdWeight.toString())}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(standard.stdFcr.toString())}
            >
              Copy FCR
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(standard.stdWeight.toString())}
            >
              Copy Standard Weight
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
