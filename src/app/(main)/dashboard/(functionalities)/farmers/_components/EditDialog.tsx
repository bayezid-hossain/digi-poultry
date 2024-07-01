import { useEffect, useRef, useState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSingleFarmer } from "@/lib/actions/farmer/actions";
import { useFormState, useFormStatus } from "react-dom";

const EditDialog = ({
  name,
  location,
  id,
  refetch,
  setOpenDropdown,
}: {
  name: string;
  location: string;
  id: string;
  refetch: () => void;
  setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  ref.current?.reset();
  const [state, formAction] = useFormState(updateSingleFarmer, null);
  const { pending } = useFormStatus();
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      setOpenDropdown(false);
      refetch();
    }
  }, [state?.success]);
  return (
    <div className=" flex flex-row items-center justify-start">
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild className=" w-full ">
          <Button variant="link" className="p-0">
            Edit Farmer
          </Button>
        </DialogTrigger>
        <DialogContent className="mb-auto sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Edit this Farmer Information</DialogTitle>
            <DialogDescription>
              Please provide input for Farmer Data, click "Update" to add it to the server.
            </DialogDescription>
          </DialogHeader>
          <form ref={ref} action={formAction} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-rows-2 items-center gap-4">
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  type="string"
                  defaultValue={name}
                  className="col-span-3"
                />
                <Input id="id" name="id" required defaultValue={id} className="hidden" />
              </div>
              <div className="grid grid-rows-2 items-center gap-4">
                <Label htmlFor="location" className="text-left">
                  Location
                </Label>
                <Input
                  id="location"
                  type="string"
                  name="location"
                  required
                  defaultValue={location}
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
              <SubmitButton
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key == " ") {
                    e.currentTarget.click();
                  }
                }}
                className="w-full"
                disabled={pending}
              >
                {" "}
                Update
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditDialog;
