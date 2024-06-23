import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addMultiStandardRow } from "@/lib/actions/fcr/actions";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { StandardData } from "./EditableColumns";
import EditableTable from "./EditableTable";

const MultiAddDialog = ({ refetch }: { refetch: () => void }) => {
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!open) refetch();
  }, [open]);
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
              <div className="mt-2 text-[10px] leading-4 text-blue-600">
                You can copy paste 'comma' or 'space' seperated data in the first field to auto fill
                rest of the inputs.
                <span>NB: The format should be 'Age', 'Std Weight', 'Std FCR'</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <EditableTable setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiAddDialog;
