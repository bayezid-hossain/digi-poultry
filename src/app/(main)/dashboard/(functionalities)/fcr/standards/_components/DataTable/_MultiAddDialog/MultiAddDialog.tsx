import { SubmitButton } from "@/components/submit-button";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
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

const MultiAddDialog = () => {
  return (
    <div>
      <Dialog modal>
        <DialogTrigger asChild>
          <Button variant="outlineLink">Insert Multiple Entries</Button>
        </DialogTrigger>
        <DialogContent className="mb-auto sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Add Multiple Standard FCR Rows for your Organization</DialogTitle>
            <DialogDescription>
              Please provide input for Standard Data, click "Add" to add it to the server.
              <p className="mt-2 text-[10px] leading-4 text-blue-600">
                You can copy paste 'comma', 'full-stop' or 'space' seperated data in the first field
                to auto fill rest of the inputs.
                <span>NB: The format should be 'Age', 'Std Weight', 'Std FCR'</span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <DialogFooter>
              <SubmitButton className="w-full"> Add</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiAddDialog;
