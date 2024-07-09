import { CyclesData } from "@/app/(main)/_types";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import clipboardCopy from "clipboard-copy";
import { CircleAlert, MoreHorizontal, Plane } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DeleteDialog from "./DeleteDialog";

const CycleCard = ({ cycle }: { cycle: CyclesData }) => {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [openUserInfoDropdown, setUserInfoDropdown] = useState<boolean>(false);
  const {
    age,
    startDate,
    createdBy,
    endDate,
    ended,
    farmerLocation,
    farmerName,
    id,
    strain,
    totalDoc,
    farmerId,
    lastFCR,
  } = cycle;
  const { firstName, lastName, id: userId, email: userEmail } = createdBy;
  return (
    <Card
      className={`m-2 h-full scale-100 cursor-pointer transition-all duration-500 ${ended ? "border-2 border-red-500" : "border-2 border-muted-foreground"}`}
      onClick={(e) => {
        e.preventDefault();
        if (lastFCR) router.push(`/dashboard/cycles/${id}`);
      }}
    >
      <div
        className="absolute right-0 top-0 cursor-pointer p-2"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
          <DropdownMenuTrigger asChild className="px-0 py-0">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className=" flex flex-col gap-y-2">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              className="border-2 border-destructive"
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <DeleteDialog id={id} setOpenDropdown={setOpenDropdown} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardHeader className="pt-8">
        <p className="text-xl">{farmerName}</p>
        <p className="text-sm">Location: {farmerLocation}</p>
        <p className="text-xs">Started at {formatDate(startDate)}</p>
        <hr />
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2 text-xs">
        <div className="grid w-full grid-cols-2">
          <p>Total DOC was {totalDoc} pcs</p>
          <p>Strain is &apos;{strain}&apos;</p>
        </div>
        <hr />
        {lastFCR ? (
          <div className="flex flex-col gap-y-2">
            <p>Last Updated {formatDate(lastFCR.createdAt)}</p>

            <hr />
            <div className="grid w-full grid-cols-2">
              <p>Standard FCR: {lastFCR.stdFcr}</p>
              <p>Current FCR: {lastFCR.fcr}</p>
            </div>
            <div className="grid w-full grid-cols-2">
              <p>Standard Weight: {lastFCR.stdWeight} gm</p>
              <p>Current Avg Weight: {lastFCR.avgWeight} gm</p>
            </div>
            <div className="grid w-full grid-cols-2">
              <p>Last Day Mortality: {lastFCR.lastDayMortality}</p>
              <p>Total Mortality: {lastFCR.totalMortality}</p>
            </div>
          </div>
        ) : null}
        <p>
          Last Updated Age is {lastFCR ? lastFCR.age : age}{" "}
          {(lastFCR ? lastFCR.age : age) > 1 ? "days" : "day"}
        </p>
        <hr />{" "}
        {!lastFCR ? (
          <div className="z-40 flex flex-col gap-y-4 text-xl">
            <p>No FCR Calculated Yet</p>
            <SubmitButton variant={"outlineLink"}>
              <Link href={`/dashboard/fcr/new?cycleId=${id}`}>Calculate FCR Now!</Link>
            </SubmitButton>
          </div>
        ) : null}
        <div className="absolute bottom-0 left-0 mt-2 flex gap-x-2 p-6 pb-2 text-xs">
          <p>
            Started by {firstName} {lastName}
          </p>
          <DropdownMenu open={openUserInfoDropdown} onOpenChange={setUserInfoDropdown}>
            <DropdownMenuTrigger asChild className="px-0 py-0">
              <CircleAlert className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="left-0 flex flex-col gap-y-2">
              <DropdownMenuItem
                onClick={async (e) => {
                  e.preventDefault();
                  await clipboardCopy(userId);
                  toast("User ID Copied to Clipboard", {
                    position: "top-center",
                  });
                  setUserInfoDropdown(false);
                }}
              >
                ID: {userId}
              </DropdownMenuItem>{" "}
              <DropdownMenuItem
                onClick={async (e) => {
                  e.preventDefault();
                  await clipboardCopy(userEmail);
                  toast("User Email Copied to Clipboard", {
                    position: "top-center",
                  });
                  setUserInfoDropdown(false);
                }}
              >
                Email: {userEmail}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      <div className="absolute left-0 top-0 p-6 pt-2">
        {ended ? (
          <p className="text-red-500">Ended at {formatDate(endDate ?? Date.now())}</p>
        ) : (
          <div className="flex gap-x-2 text-xs text-muted-foreground">
            <Plane className="h-4 w-4" />
            <p>Running</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CycleCard;
