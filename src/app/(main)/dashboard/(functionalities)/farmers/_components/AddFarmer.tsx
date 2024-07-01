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

import { CreateFarmer } from "@/lib/actions/farmer/actions";

const AddDialog = ({ refetch }: { refetch: () => void }) => {
  const [state, formAction] = useFormState(CreateFarmer, null);
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    console.log("should close");
    setOpen(false);
    refetch();
    return;
  }, [state?.success]);
  return (
    <div className="flex flex-row items-center justify-start">
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild>
          <Button variant="outline">Create Farmer</Button>
        </DialogTrigger>
        <DialogContent className="mb-auto sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Create a Farmer for your Organization</DialogTitle>
            <DialogDescription>
              Please provide input for Farmer Data, click "Create" to add it to the server.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-rows-2 items-center gap-4">
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  type="text"
                  placeholder="Farmer Name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-rows-2 items-center gap-4">
                <Label htmlFor="location" className="text-left">
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  name="location"
                  required
                  placeholder="Location"
                  className="col-span-3"
                />
              </div>{" "}
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
