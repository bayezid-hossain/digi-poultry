import React, {
  ChangeEvent,
  ClipboardEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import { SubmitButton } from "@/components/submit-button";
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
import { addMultiStandardRow } from "@/lib/actions/fcr/actions";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { PlusCircle, Trash2 } from "lucide-react";
import { useFormState } from "react-dom";
import { EditableColumns } from "./EditableColumns";
import { StandardData } from "@/app/(main)/_types";

const EditableTable = ({
  setOpen,
  refetch,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  refetch: () => void;
}) => {
  const initialData: StandardData = { age: 0, stdWeight: 0, stdFcr: 0 };
  const [data, setData] = useState<StandardData[]>([initialData]);
  const lastRowAgeInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useFormState(addMultiStandardRow, null);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  useEffect(() => {
    if (!isDeleting) {
      if (lastRowAgeInputRef.current) {
        lastRowAgeInputRef.current.focus();
        lastRowAgeInputRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setDeleting(false);
    }
  }, [data.length]);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      refetch();
    }
  }, [state?.success]);
  const onPaste = (event: ClipboardEvent) => {
    event.preventDefault();

    // Get the pasted data from the clipboard
    const pasteData = (event.clipboardData || window.Clipboard).getData("text");

    // Process the pasted data to split by spaces or commas
    const processedData = pasteData
      .replaceAll(/[^0-9,.\s]/g, "")
      .split(/[\s,]+/)
      .map((value) => parseFloat(value));

    // Update the state with the processed data\
    const result: StandardData[] = [];

    for (let i = 0; i < processedData.length; i += 3) {
      const standardData: StandardData = {
        age: processedData[i] ?? 0,
        stdWeight: processedData[i + 1] ?? 0,
        stdFcr: processedData[i + 2] ?? 0,
      };
      result.push(standardData);
    }

    setData(result);
  };
  const handleInputChange = (index: number, field: keyof StandardData, value: string) => {
    const updatedData = data.map((item, i) =>
      i === index
        ? {
            ...item,
            [field]:
              field != "age" && field != "stdWeight"
                ? value.endsWith(".")
                  ? value
                  : Number.isNaN(Number(value))
                    ? 0
                    : Number(value)
                : Number.isNaN(Number(value))
                  ? 0
                  : Number(value),
          }
        : item,
    );
    setData(updatedData);
  };
  const removeRow = (index: number) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
    setDeleting(true);
  };
  const handleSubmit = () => {
    console.log(data);
  };

  const table = useReactTable({
    data: data,
    columns: EditableColumns({ handleInputChange }),
    getCoreRowModel: getCoreRowModel(),

    state: {},
  });
  return (
    <div className="scroll-hidden h-full max-h-[70vh] overflow-y-auto p-4">
      <Table className="scroll-style max-h-[50vh] overflow-y-auto">
        <TableHeader className="" tabIndex={-1}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} tabIndex={-1}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} tabIndex={-1}>
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
          {data.map((item, index) => (
            <TableRow key={index} className="gap-x-2">
              <TableCell className="max-w-16 p-2">
                <Input
                  type="text"
                  value={item.age}
                  onPaste={onPaste}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(index, "age", e.target.value)
                  }
                  className="m-2 w-full rounded border p-0 text-center sm:p-2"
                  ref={index === data.length - 1 ? lastRowAgeInputRef : null}
                />
              </TableCell>
              <TableCell className="max-w-16 p-2">
                <Input
                  type="text"
                  value={item.stdWeight}
                  onPaste={onPaste}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(index, "stdWeight", e.target.value)
                  }
                  className="m-2 w-full rounded border p-0 text-center sm:p-2"
                />
              </TableCell>
              <TableCell className="max-w-16 p-2">
                <Input
                  type="text"
                  value={item.stdFcr}
                  onPaste={onPaste}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(index, "stdFcr", e.target.value)
                  }
                  className="m-2 w-full rounded border p-0 text-center sm:p-2"
                />
              </TableCell>{" "}
              <TableCell className="max-w-16 p-2">
                <Button
                  onClick={() => removeRow(index)}
                  className="w-auto bg-transparent hover:bg-transparent"
                >
                  <Trash2 className="text-destructive hover:scale-110 hover:shadow-xl" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <form action={formAction}>
        {state?.fieldError ? (
          <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
            {Object.values(state.fieldError).map((err) => (
              <li className="ml-4" key={err}>
                {err}
              </li>
            ))}
          </ul>
        ) : state?.formError ? (
          <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
            {state?.formError}
          </p>
        ) : null}
        <Input value={JSON.stringify(data)} className="hidden" name="datas" />
        <div className="mt-4 flex justify-between">
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setData([...data, { ...initialData }]);
            }}
            className="bg-green-500"
          >
            <PlusCircle className="pr-2" />
            Add Row
          </Button>
          <SubmitButton onClick={handleSubmit} variant="default">
            Insert All
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default EditableTable;
