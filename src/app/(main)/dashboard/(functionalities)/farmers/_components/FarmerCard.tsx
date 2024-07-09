import { SubmitButton } from "@/components/submit-button";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { deleteSingleFarmer } from "@/lib/actions/farmer/actions";
import { MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import DeleteDialog from "./DeleteDialog";
import EditDialog from "./EditDialog";
import useUserDataStore from "../../../stores/userStore";

const FarmerCard = ({
  name,
  location,
  id,
  refetch,
  createdBy,
}: {
  name: string;
  location: string;
  id: string;
  createdBy: string;
  refetch: () => void;
}) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { data: userId } = useUserDataStore();
  return (
    <Card
      className="m-2 h-fit scale-100 cursor-pointer transition-all duration-500 "
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {createdBy === userId ? (
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
              <div className="flex flex-col">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <EditDialog
                    id={id}
                    location={location}
                    name={name}
                    refetch={refetch}
                    setOpenDropdown={setOpenDropdown}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="border-2 border-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DeleteDialog id={id} refetch={refetch} setOpenDropdown={setOpenDropdown} />
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
      <CardHeader>
        <p>{name}</p>
      </CardHeader>
      <CardContent>{location}</CardContent>
    </Card>
  );
};

export default FarmerCard;
