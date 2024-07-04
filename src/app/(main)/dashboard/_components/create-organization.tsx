"use client";
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
import { CreateOrg } from "@/lib/actions/organization/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

export const CreateOrganization = () => {
  const [state, formAction] = useFormState(CreateOrg, null);
  const [changing, setChanging] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!changing) return;
    if (state?.success) {
      setOpen(false);
      setChanging(false);
      router.refresh();
    }
  }, [state?.success, changing]);
  useEffect(() => {
    if (changing) setChanging(false);
  }, [state?.error, state?.formError, state?.fieldError]);
  return (
    <div>
      {" "}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="">
            Create Organization
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {changing ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-y-8 ">
              <Loader2 className=" animate-spin" />
              <p className="animate-pulse">Changing Workspace</p>
            </div>
          ) : (
            <form action={formAction} onSubmit={() => setChanging(true)}>
              <DialogHeader>
                <DialogTitle>Create Organization</DialogTitle>
                <DialogDescription>Create an organization and start managing it.</DialogDescription>
                <div className="grid place-items-start gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="orgName"
                      placeholder="Your organization name"
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
                  <SubmitButton className="w-full">Create</SubmitButton>
                </DialogFooter>
              </DialogHeader>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
