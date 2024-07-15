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
import { Paths } from "@/lib/constants";
import useUserDataStore from "../../../stores/userStore";

const CycleCard = ({ cycle }: { cycle: CyclesData }) => {
  const router = useRouter();
  const { data: loggedInUser } = useUserDataStore();
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
        e.stopPropagation();
        router.push(`${Paths.Cycles}/${id}`);
      }}
    >
      <div
        className={`absolute right-0 top-0 flex cursor-pointer flex-col items-center justify-end gap-y-2 ${loggedInUser === userId ? "px-2" : "mt-8 p-2"}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {loggedInUser === userId ? (
          <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger aria-label="creator" asChild className="px-0 py-0">
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className=" flex flex-col gap-y-2">
              <DropdownMenuLabel aria-label="actions">Actions</DropdownMenuLabel>

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
        ) : null}
      </div>
      <CardHeader className="pt-8">
        <div className="flex items-center justify-start">
          <div
            className={` -mt-4 flex w-fit flex-col items-center justify-center rounded-full  rounded-bl-none border-2 px-5 py-2 ${ended ? "border-red-900" : "border-b-green-600 border-l-green-700 border-r-green-500 border-t-green-600"}`}
          >
            <p className="text-xs">Day</p>
            <p className="text-2xl">{lastFCR ? lastFCR.age : age}</p>
          </div>
        </div>
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
        <hr />{" "}
        {!lastFCR ? (
          <div className="z-40 flex flex-col gap-y-4 text-xl">
            <p>No FCR Calculated Yet</p>
            {loggedInUser === cycle.createdBy.id && !cycle.ended && !cycle.endDate ? (
              <SubmitButton
                variant={"outlineLink"}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <Link href={`${Paths.NewFCR}?cycleId=${id ?? ""}`}>Calculate FCR Now!</Link>
              </SubmitButton>
            ) : (
              <div className="text-xs">
                FCR history will be shown as soon as cycle creator/mod creates any FCR
              </div>
            )}
          </div>
        ) : null}
        <div className="absolute bottom-0 left-0 mt-2 flex gap-x-2 p-6 pb-2 text-xs">
          <p>
            Started by {firstName} {lastName}
          </p>
          <DropdownMenu open={openUserInfoDropdown} onOpenChange={setUserInfoDropdown}>
            <DropdownMenuTrigger asChild>
              <button aria-label="Open creator info" className="px-0 py-0">
                <CircleAlert className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="left-0 flex flex-col gap-y-2">
              <DropdownMenuItem
                aria-label="Creator ID"
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
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Creator Email"
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
    </Card>
  );
};

export default CycleCard;
