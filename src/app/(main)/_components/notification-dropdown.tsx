import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, BellDotIcon } from "lucide-react";
import Link from "next/link";
import InviteNotification from "./InviteNotification";
import { Card } from "@/components/ui/card";

type NotificationProps = {
  message: string;
  eventType: "normal" | "cycle" | "farmerBilling" | "companyBilling" | "invitation";
  invite: {
    id: string | null;
    createdAt: Date | null;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | null;
  } | null;
  from: {
    firstName: string;
    lastName: string;
  } | null;
  org: {
    orgId: string;
    orgName: string;
  } | null;
  cycleId?: string | null;
  id: string;
  time: Date;
}[];

const NotificationDropDown = ({ notifications }: { notifications?: NotificationProps }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {notifications ? (
          <BellDotIcon className="border-2border-red-800 h-7 w-7 rounded-full p-1" />
        ) : (
          <Bell className="h-7 w-7 rounded-full border-2 border-primary  p-1" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2 w-60 sm:w-96">
        <DropdownMenuLabel className="text-xl text-foreground">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications?.map(({ message, eventType, cycleId, invite, from, org, time }) => {
            return (
              <div className="flex flex-col gap-y-1">
                <DropdownMenuItem className="cursor-pointer px-0 py-1 text-muted-foreground">
                  {eventType === "invitation" && invite && from && org ? (
                    <InviteNotification
                      invite={invite}
                      from={from}
                      org={org}
                      cycle={cycleId ? true : false}
                    />
                  ) : (
                    <Card className="w-full rounded-none border-0 p-2">
                      <Link
                        className="flex w-full flex-col items-start justify-start"
                        href={`${eventType == "normal" ? "" : eventType === "cycle" ? `/dashboard/cycles/${cycleId}` : ""}`}
                      >
                        <p className="w-full text-start">{message}</p>
                      </Link>
                    </Card>
                  )}{" "}
                </DropdownMenuItem>
                <hr className="w-full border-[1px] border-primary"></hr>
              </div>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="p-0">View All</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropDown;
