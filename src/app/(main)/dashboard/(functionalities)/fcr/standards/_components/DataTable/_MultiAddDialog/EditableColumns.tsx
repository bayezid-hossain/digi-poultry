"use client";
import { StandardData } from "@/app/(main)/_types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionResponse } from "@/lib/actions/fcr/actions";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChangeEvent,
  ClipboardEvent,
  Dispatch,
  KeyboardEvent,
  MutableRefObject,
  SetStateAction,
} from "react";

export const EditableColumns = ({
  handleInputChange,
}: {
  handleInputChange: (index: number, field: keyof StandardData, value: string) => void;
}): ColumnDef<StandardData>[] => [
  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <p className="flex w-full flex-1 items-center justify-center px-4 text-center sm:px-4">
          Age
        </p>
      );
    },
    cell: ({ row, table }) => {
      return (
        <div className="flex w-full items-center justify-center">
          <Input
            type="number"
            value={row.getValue("age")}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(row.index, "age", e.target.value)
            }
            className="w-full rounded border p-2"
          />
        </div>
      );
    },
    enableColumnFilter: false,
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "stdWeight",
    header: ({ column }) => {
      return (
        <p className="flex w-full flex-1 items-center justify-center px-4 text-center sm:px-4">
          <span className="hidden sm:flex">Standard Weight</span>
          <span className="flex sm:hidden">Std Wt</span>
        </p>
      );
    },
    cell: ({ row, table }) => {
      return (
        <div className="flex w-full items-center justify-center">
          <Input
            type="number"
            value={row.getValue("stdWeight")}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(row.index, "stdWeight", e.target.value)
            }
            className="w-full rounded border p-2"
          />
        </div>
      );
    },
    enableColumnFilter: false,
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "stdFcr",
    header: ({ column }) => {
      return (
        <p className="flex w-full flex-1 items-center justify-center px-4 text-center sm:px-4">
          <span className="hidden sm:flex">Standard FCR</span>
          <span className="flex sm:hidden">Std FCR</span>
        </p>
      );
    },
    cell: ({ row, table }) => {
      return (
        <div className="flex w-full items-center justify-center">
          <Input
            type="number"
            value={row.getValue("stdFcr")}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(row.index, "stdFcr", e.target.value)
            }
            className="w-full rounded border p-2"
          />
        </div>
      );
    },
    enableColumnFilter: false,
    enableHiding: false,
    enableGlobalFilter: false,
  },
];
