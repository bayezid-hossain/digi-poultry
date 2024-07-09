"use client";
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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Paths } from "@/lib/constants";
import { getTimeDifference } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { farmer } from "@/server/db/schema";
import useUserDataStore from "../dashboard/stores/userStore";

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
  linkId?: string | null;
  id: string;
  time: Date;
  farmerName: string | null;
}[];

const NotificationDropDown = ({
  notifications,
  userId,
}: {
  notifications?: NotificationProps;
  userId: string;
}) => {
  const { setData, data } = useUserDataStore();
  useEffect(() => {
    if (data !== userId) setData(userId);
  }, [userId]);
  const [open, setOpen] = useState<boolean>(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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
        <DropdownMenuGroup className="gap-y-4">
          {notifications && notifications?.length > 0 ? (
            <div key={"notification-main-div"}>
              {notifications?.map(
                ({ farmerName, message, eventType, linkId, invite, from, org, time }) => {
                  return (
                    <div
                      key={"notification-outer-wrapper"}
                      className="scroll-style flex max-h-screen flex-col gap-y-1 overflow-y-auto pt-1"
                    >
                      <DropdownMenuItem className="cursor-pointer text-muted-foreground">
                        {eventType === "invitation" && invite && from && org && farmerName ? (
                          <InviteNotification
                            key={invite.id}
                            invite={invite}
                            from={from}
                            org={org}
                            farmerName={farmerName}
                            cycle={linkId ? true : false}
                          />
                        ) : (
                          <form className="w-full">
                            <Card>
                              <Button
                                type="submit"
                                className="flex h-full w-full flex-col items-start justify-start bg-transparent p-2 text-foreground hover:bg-transparent"
                                onClick={(e) => {
                                  setOpen(false);
                                }}
                              >
                                <Link
                                  className="flex h-full flex-col gap-y-2"
                                  href={`${eventType == "normal" ? "" : eventType === "cycle" ? `${Paths.Cycles}/${linkId}` : eventType === "companyBilling" ? `${Paths.CompanyBilling}/${linkId}` : eventType === "farmerBilling" ? `${Paths.FarmerBilling}/${linkId}` : ""}`}
                                >
                                  <p className="w-full text-start font-bold">{message}</p>
                                  {time && (
                                    <p className="w-full text-start text-xs">
                                      {getTimeDifference(time)}
                                    </p>
                                  )}
                                </Link>
                              </Button>{" "}
                            </Card>
                          </form>
                        )}{" "}
                      </DropdownMenuItem>
                      <hr className="w-full border-[1px] border-primary"></hr>
                    </div>
                  );
                },
              )}
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center">
              <p>Nothing to show </p>
            </div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="p-0">View All</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropDown;
