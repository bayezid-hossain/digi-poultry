import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import EditableTable from "./EditableTable";

const MultiAddDialog = ({ refetch }: { refetch: () => void }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div tabIndex={-1}>
      <Dialog modal open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild tabIndex={-1}>
          <Button variant="outlineLink">Insert Multiple Entries</Button>
        </DialogTrigger>
        <DialogContent tabIndex={-1} className="mb-auto max-h-[90vh] sm:max-w-[625px]">
          <DialogHeader tabIndex={-1}>
            <DialogTitle>Add Multiple Standard FCR Rows for your Organization</DialogTitle>
            <DialogDescription tabIndex={-1}>
              Please provide input for Standard Data, click "Add" to add it to the server.
              <div className="mt-2 text-[10px] leading-4 text-secondary-foreground">
                You can copy paste 'comma' or 'space' seperated data in the first field to auto fill
                rest of the inputs.
                <span>NB: The format should be 'Age', 'Std Weight', 'Std FCR'</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <EditableTable setOpen={setOpen} refetch={refetch} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiAddDialog;
