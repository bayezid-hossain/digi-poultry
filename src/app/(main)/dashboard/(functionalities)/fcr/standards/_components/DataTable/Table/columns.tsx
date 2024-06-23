"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import DeleteDialog from "../../DeleteDialog";
import EditDialog from "../../EditDialog";
export type StandardData = {
  age: number;
  organization: string;
  stdFcr: number;
  stdWeight: number;
};
interface columnProps {
  onEdit: (age: number) => Promise<void>;
  onDelete: (age: number) => Promise<void>;
  previousData: StandardData[];
}
export const columns = ({
  onEdit,
  onDelete,
  previousData,
}: columnProps): ColumnDef<StandardData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex w-full items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex w-full items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="self-center"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full px-4 text-center sm:px-4"
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
      // console.log(value);
      // console.log(row.getValue(id));
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
          className="w-full px-4 text-center sm:px-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="hidden sm:flex">Standard Weight</p>
          <p className="flex sm:hidden">Std Wt</p>
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
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
          className="w-full px-4 text-center sm:px-4"
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
          <DropdownMenuTrigger asChild className="px-0 py-0">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="mt-2.5">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="py-0.5"
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <EditDialog
                onEdit={onEdit}
                newRequest={true}
                defaultAge={standard.age}
                defaultFcr={standard.stdFcr}
                defaultWeight={standard.stdWeight}
              />
            </DropdownMenuItem>
            <DropdownMenuItem className="py-0.5">
              <DeleteDialog newRequest={true} onDelete={onDelete} defaultAge={standard.age} />
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
