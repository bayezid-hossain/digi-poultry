import React, { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { deleteSingleRowFCRStandard, updateSingleStandardRow } from "@/lib/actions/fcr/actions";
import { DialogClose } from "@radix-ui/react-dialog";
import { StandardData } from "./DataTable/Table/columns";

const DeleteDialog = ({
  defaultAge,
  onDelete,
  newRequest,
}: {
  newRequest: boolean;
  defaultAge: number;
  onDelete: (age: number) => Promise<void>;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  ref.current?.reset();
  const [state, formAction] = useFormState(deleteSingleRowFCRStandard, null);
  const { pending } = useFormStatus();
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (state) {
      if (newRequest && state?.success) {
        console.log("should close");
        setOpen(false);
        state.success = false;
        onDelete(defaultAge)
          .then(() => {
            console.log("Successfully Deleted");
          })
          .catch((error: any) => {
            console.log(error);
          });
        return;
      }
    }
  });
  return (
    <div className=" flex flex-row items-center justify-start">
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild className=" w-full ">
          <Button
            onClick={(e) => e.stopPropagation()}
            variant="link"
            className="w-full p-0 text-destructive"
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
            <form ref={ref} action={formAction}>
              <Input name="age" defaultValue={defaultAge} type="string" className="hidden" />
              <SubmitButton
                className="m-0 w-full bg-destructive text-destructive-foreground"
                disabled={pending}
              >
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
