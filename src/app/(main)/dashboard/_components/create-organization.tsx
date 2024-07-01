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
  return (
    <div>
      {" "}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* {changing ? (
          <div className="fixed left-0 top-0 z-[100] flex h-screen w-full flex-col items-center justify-center gap-y-8 bg-slate-800">
            <Loader2 className="z-20 animate-spin" />
            <p className="z-20 animate-pulse">Changing Workspace</p>
          </div>
        ) : null} */}
        <DialogTrigger asChild>
          <Button variant="default" className="">
            Create Organization
          </Button>
        </DialogTrigger>
        <DialogContent className="z-20 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>Create an organization and start managing it.</DialogDescription>
          </DialogHeader>

          <form action={formAction}>
            <div className="grid gap-4 py-4">
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
              <SubmitButton
                className="w-full"
                onClick={() => {
                  setChanging(true);
                }}
              >
                {" "}
                Create
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
