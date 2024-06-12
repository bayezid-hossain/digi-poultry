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
import { updateSingleStandardRow } from "@/lib/fcr/actions";

const EditDialog = ({
  defaultAge,
  defaultWeight,
  defaultFcr,
  newRequest,
}: {
  defaultAge: number;
  defaultWeight: number;
  defaultFcr: number;
  newRequest: boolean;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  ref.current?.reset();
  const [state, formAction] = useFormState(updateSingleStandardRow, null);
  const { pending } = useFormStatus();
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (state) {
      if (newRequest && state?.success) {
        console.log("should close");
        setOpen(false);
        state.success = false;
        return;
      }
    }
  });
  return (
    <div className=" flex flex-row items-center justify-start">
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild className=" w-full ">
          <Button onClick={(e) => e.stopPropagation()} variant="link" className="p-0">
            Edit Row
          </Button>
        </DialogTrigger>
        <DialogContent onClick={(e) => e.stopPropagation()} className="mb-auto sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Edit this FCR Row</DialogTitle>
            <DialogDescription>
              Please provide input for Standard Data, click "Update" to add it to the server.
            </DialogDescription>
          </DialogHeader>
          <form ref={ref} action={formAction} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-rows-2 items-center gap-4">
                <Label htmlFor="age" className="text-left">
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  required
                  type="string"
                  defaultValue={defaultAge}
                  className="col-span-3"
                />
                <Input
                  id="previousAge"
                  name="previousAge"
                  required
                  defaultValue={defaultAge}
                  className="hidden"
                />
              </div>
              <div className="grid grid-rows-2 items-center gap-4">
                <Label htmlFor="stdWeight" className="text-left">
                  Standard Weight (gm)
                </Label>
                <Input
                  id="stdWeight"
                  type="string"
                  name="stdWeight"
                  required
                  defaultValue={defaultWeight}
                  className="col-span-3"
                />
              </div>{" "}
              <div className="grid grid-rows-2 items-center gap-4">
                <Label htmlFor="stdFcr" className="text-left">
                  Standard FCR
                </Label>
                <Input
                  id="stdFcr"
                  name="stdFcr"
                  type="string"
                  required
                  defaultValue={defaultFcr}
                  className="col-span-3"
                />
              </div>
            </div>
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
            <SubmitButton className="w-full" disabled={pending}>
              {" "}
              Update
            </SubmitButton>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditDialog;
