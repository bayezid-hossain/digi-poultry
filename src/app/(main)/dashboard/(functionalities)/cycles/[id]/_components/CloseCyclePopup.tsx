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
import { closeCycle, deleteSingleCycle } from "@/lib/actions/cycle/actions";
import { DialogClose } from "@radix-ui/react-dialog";
import { useFormState, useFormStatus } from "react-dom";
import useCycleDataStore from "@/app/(main)/dashboard/stores/cycleStore";
import { Dot } from "lucide-react";

const CloseCyclePopup = ({ id }: { id: string | undefined }) => {
  const ref = useRef<HTMLFormElement>(null);
  ref.current?.reset();
  const { pending } = useFormStatus();
  const [closeCycleState, closeCycleAction] = useFormState(closeCycle, null);
  const { updateData, getItem } = useCycleDataStore();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    if (closeCycleState?.success && id) {
      setOpenDialog(false);
      const cycle = getItem(id);
      if (cycle) updateData(id, { ...cycle, ended: true, endDate: new Date() });
    }
  }, [closeCycleState?.success]);
  return (
    <div className="flex w-full flex-row items-center justify-start">
      <Dialog open={openDialog} onOpenChange={setOpenDialog} modal>
        <DialogTrigger asChild className=" w-full ">
          <Button onClick={(e) => e.stopPropagation()} variant="destructive">
            Close Cycle
          </Button>
        </DialogTrigger>
        <DialogContent onClick={(e) => e.stopPropagation()} className="mb-auto sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Are you sure you want to close the cycle?</DialogTitle>
            <DialogDescription>
              Please confirm that you want to delete this information, the following actions cannot
              be performed when the cycle is closed:
              <ul className="mt-2 font-bold">
                <li>
                  <p className="flex">
                    <Dot />
                    You cannot Calculate any new FCR for this Cycle!
                  </p>
                </li>
                <li>
                  <p className="flex">
                    <Dot />
                    You cannot invite anyone new to this cycle.
                  </p>
                </li>
                <li>
                  <p className="flex">
                    <Dot />
                    You cannot restart the cycle.
                  </p>
                </li>
              </ul>
              You will be able to do the following things once you close this cycle:
              <ul className="mt-2 font-bold">
                <li>
                  <p className="flex">
                    <Dot />
                    You can Calculate Company and Farmer Bill.
                  </p>
                </li>
                <li>
                  <p className="flex">
                    <Dot />
                    You can assign the farmer involved in this cycle to a new cycle.
                  </p>
                </li>{" "}
                <li>
                  <p className="flex">
                    <Dot />
                    You can calculate Medicine Cost!
                  </p>
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row justify-center gap-x-8">
            <DialogClose className="flex flex-col items-center justify-center">
              <Button variant="secondary">Exit</Button>
            </DialogClose>
            <form action={closeCycleAction}>
              <Input name="id" defaultValue={id} type="string" className="hidden" />
              <SubmitButton className="m-0 w-full bg-destructive text-destructive-foreground">
                Close The Cycle
              </SubmitButton>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CloseCyclePopup;
