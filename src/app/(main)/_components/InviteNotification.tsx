"use client";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { JoinOrganization, RejectInvitation } from "@/lib/actions/organization/actions";
import { formatDate, getTimeDifference } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

const InviteNotification = ({
  invite,
  from,
  org,
  cycle,
  farmerName,
}: {
  invite: {
    id: string | null;
    createdAt: Date | null;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | null;
  };
  from: {
    firstName: string;
    lastName: string;
  };
  org: {
    orgId: string;
    orgName: string;
  };
  cycle?: boolean;
  farmerName: string | null;
}) => {
  const router = useRouter();
  const [inviteStatus, setStatus] = useState<"PENDING" | "ACCEPTED" | "REJECTED" | null>(
    invite.status,
  );
  const [acceptState, acceptFormAction] = useFormState(JoinOrganization, null);
  const [rejectState, rejectFormAction] = useFormState(RejectInvitation, null);
  useEffect(() => {
    if (acceptState?.success) {
      setStatus("ACCEPTED");
      router.refresh();
    }
  }, [acceptState?.success]);
  useEffect(() => {
    if (rejectState?.success) {
      setStatus("REJECTED");
    }
  }, [rejectState?.success]);
  useEffect(() => {
    if (inviteStatus !== invite.status)
      toast(inviteStatus + " Successfully", { position: "top-center" });
  }, [inviteStatus]);
  const { id, createdAt: time } = invite;
  const { firstName, lastName } = from;
  const { orgId, orgName } = org;
  return (
    <Card className="flex w-full flex-col gap-y-4 p-2 text-foreground">
      <p>
        <span className="font-bold">
          {firstName} {lastName}
        </span>{" "}
        has invited you to join{" "}
        {cycle ? (
          <p>
            the cycle of <span className="font-bold">{farmerName}</span> in the{" "}
          </p>
        ) : (
          "the "
        )}
        <span className="font-bold  underline">&apos;{orgName}&apos;</span> organization.{" "}
      </p>
      {inviteStatus === "PENDING" ? (
        <div className="flex w-full justify-between gap-x-4">
          <form
            action={acceptFormAction}
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Input name="invitationId" defaultValue={invite.id ?? -1} className="hidden" />
            <SubmitButton
              variant={"secondary"}
              className="h-8 w-full bg-green-600 px-3 py-0 text-xs font-bold text-black hover:bg-green-400 hover:text-black"
            >
              Join
            </SubmitButton>
          </form>
          <form
            action={rejectFormAction}
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Input name="invitationId" defaultValue={invite.id ?? -1} className="hidden" />

            <SubmitButton variant={"destructive"} className="h-8 w-full px-3 py-0 text-xs">
              Reject
            </SubmitButton>
          </form>
        </div>
      ) : (
        <div>
          {inviteStatus === "ACCEPTED" ? (
            <div className="flex w-full justify-center">Accepted</div>
          ) : (
            <div className="w-full items-center">Rejected</div>
          )}
        </div>
      )}
      {time && <p className="text-xs">{getTimeDifference(time)}</p>}
    </Card>
  );
};

export default InviteNotification;
