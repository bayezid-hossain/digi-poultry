import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Invite } from "@/lib/actions/organization/actions";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "sonner";
const InvitePopup = ({ cycleId }: { cycleId?: string }) => {
  const [state, formAction] = useFormState(Invite, null);
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      toast("Invite Sent!", { position: "top-center" });
    }
  }, [state?.success]);

  return (
    <div className="pt-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="w-full">
            Invite {cycleId ? " to this cycle" : " "}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form action={formAction}>
            <DialogHeader>
              <DialogTitle>Invite</DialogTitle>
              <DialogDescription>
                Invite people to contribute or observe your organization{" "}
                {cycleId ? "and cycles" : ""}.
              </DialogDescription>
              <div className="grid place-items-start gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="name"
                    name="to"
                    placeholder="Enter email address"
                    className="col-span-3"
                  />{" "}
                  <Input
                    id="cycleId"
                    name="cycleId"
                    defaultValue={cycleId}
                    className="col-span-3 hidden"
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
              ) : state?.error ? (
                <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
                  {state?.error}
                </p>
              ) : null}
              <DialogFooter>
                <SubmitButton className="w-full">Invite</SubmitButton>
              </DialogFooter>
            </DialogHeader>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvitePopup;
