import { CyclesData } from "@/app/(main)/_types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import DeleteDialog from "./DeleteDialog";

const CycleCard = ({ cycle }: { cycle: CyclesData }) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { age, createdBy, endDate, ended, farmerLocation, farmerName, id, strain, totalDoc } =
    cycle;
  return (
    <Card
      className="m-2 h-fit scale-100 cursor-pointer transition-all duration-500 "
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <div
        className="absolute right-0 top-0 cursor-pointer p-2"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
          <DropdownMenuTrigger asChild className="px-0 py-0">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className=" flex flex-col gap-y-2">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              className="border-2 border-destructive"
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <DeleteDialog id={id} setOpenDropdown={setOpenDropdown} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardHeader>
        <p className="text-xl">{farmerName}</p>
        <p className="text-sm">Location: {farmerLocation}</p>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default CycleCard;
