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
import React from "react";

type NotificationProps = {
  message: string;
  eventType: "normal" | "cycle" | "farmerBilling" | "companyBilling" | "invitation";
  invitationId?: string | null;
  cycleId?: string | null;
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
      <DropdownMenuContent align="end" className="mt-2 w-60">
        <DropdownMenuLabel className="text-muted-foreground">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications?.map(({ message, eventType, cycleId, invitationId }) => {
            return (
              <DropdownMenuItem className="cursor-pointer text-muted-foreground" asChild>
                <Link
                  href={`${eventType == "normal" ? "" : eventType === "cycle" ? `/dashboard/cycles/${cycleId}` : ""}`}
                >
                  {message}
                </Link>
              </DropdownMenuItem>
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
