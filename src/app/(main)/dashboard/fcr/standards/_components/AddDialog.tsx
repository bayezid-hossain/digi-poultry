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
import { useFormState } from "react-dom";
import { addSingleStandardRow } from "@/lib/fcr/actions";

const AddDialog = ({
  defaultAge,
  defaultWeight,
  defaultFcr,
  refetch,
  newRequest,
}: {
  defaultAge: string;
  defaultWeight: string;
  defaultFcr: string;
  refetch: Function;
  newRequest: boolean;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  ref?.current?.reset();
  let [state, formAction] = useFormState(addSingleStandardRow, null);
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (state) {
      if (newRequest && state?.success) {
        console.log("should close");
        setOpen(false);
        state.success = false;
        refetch();
        return;
      }
    }
  });
  return (
    <div className="ml-auto flex flex-row items-center justify-start">
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild>
          <Button variant="outline">Add Row</Button>
        </DialogTrigger>
        <DialogContent className="mb-auto sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Add another Standard FCR Row</DialogTitle>
            <DialogDescription>
              Please provide input for Standard Data, click "Add" to add it to the server.
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
                  type="number"
                  defaultValue={defaultAge}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-rows-2 items-center gap-4">
                <Label htmlFor="stdWeight" className="text-left">
                  Standard Weight (gm)
                </Label>
                <Input
                  id="stdWeight"
                  type="number"
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
                  type="number"
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
            <DialogFooter>
              <SubmitButton className="w-full"> Add</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddDialog;
