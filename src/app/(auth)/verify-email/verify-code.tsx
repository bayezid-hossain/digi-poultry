"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { ExclamationTriangleIcon } from "@/components/icons";
import {
  logout,
  verifyEmail,
  resendVerificationEmail as resendEmail,
} from "@/lib/actions/auth/actions";
import { SubmitButton } from "@/components/submit-button";

export const VerifyCode = () => {
  const [verifyEmailState, verifyEmailAction] = useFormState(verifyEmail, null);
  const [resendState, resendAction] = useFormState(resendEmail, null);
  const codeFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resendState?.success) {
      toast("Email sent!", {
        position: "top-center",
      });
    }
    if (resendState?.error) {
      toast(resendState.error, {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
        position: "top-center",
      });
    }
  }, [resendState?.error, resendState?.success]);

  useEffect(() => {
    if (verifyEmailState?.error) {
      console.log(verifyEmailState.error);
      toast(verifyEmailState.error, {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
        position: "top-center",
      });
    }
  }, [verifyEmailState]);

  return (
    <div className="flex flex-col gap-2">
      <form ref={codeFormRef} action={verifyEmailAction}>
        <Label htmlFor="code">Verification code</Label>
        <Input className="mt-2" type="text" id="code" inputMode="numeric" name="code" required />
        <SubmitButton className="mt-4 w-full">Verify</SubmitButton>
      </form>
      <form action={resendAction}>
        <SubmitButton className="w-full" variant="secondary">
          Resend Code
        </SubmitButton>
      </form>
      <form action={logout}>
        <SubmitButton variant="link" className="p-0 font-normal">
          Not you? Log out now.
        </SubmitButton>
      </form>
    </div>
  );
};
