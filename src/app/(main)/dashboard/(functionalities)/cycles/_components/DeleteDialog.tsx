import React, { useEffect, useRef, useState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteSingleCycle } from "@/lib/actions/cycle/actions";
import { DialogClose } from "@radix-ui/react-dialog";
import { useFormState, useFormStatus } from "react-dom";
import useCycleDataStore from "../../../stores/cycleStore";

const DeleteDialog = ({
  id,
  setOpenDropdown,
}: {
  id: string;
  setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  ref.current?.reset();
  const { pending } = useFormStatus();
  const [deleteFarmerState, deleteFormAction] = useFormState(deleteSingleCycle, null);
  const { removeData } = useCycleDataStore();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    if (deleteFarmerState?.success) {
      setOpenDialog(false);
      setOpenDropdown(false);
      removeData(id);
    }
  }, [deleteFarmerState?.success]);
  return (
    <div className="flex w-full flex-row items-center justify-start">
      <Dialog open={openDialog} onOpenChange={setOpenDialog} modal>
        <DialogTrigger asChild className=" w-full ">
          <Button
            onClick={(e) => e.stopPropagation()}
            variant="link"
            className="h-6 w-full justify-start p-0 text-start text-destructive"
          >
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent onClick={(e) => e.stopPropagation()} className="mb-auto sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete?</DialogTitle>
            <DialogDescription>
              Please confirm that you want to delete this information, it cannot be recovered once
              deleted!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row justify-center gap-x-8">
            <DialogClose className="flex flex-col items-center justify-center">No</DialogClose>
            <form action={deleteFormAction}>
              <Input name="id" defaultValue={id} type="string" className="hidden" />
              <SubmitButton className="m-0 w-full bg-destructive text-destructive-foreground">
                Yes
              </SubmitButton>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteDialog;
