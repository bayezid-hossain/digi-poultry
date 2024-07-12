"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/loading-button";
import { ExclamationTriangleIcon } from "@/components/icons";
import { logout } from "@/lib/actions/auth/actions";
import { APP_TITLE, Paths } from "@/lib/constants";
import { toast } from "sonner";
import { PersonIcon } from "@radix-ui/react-icons";
import useUserDataStore from "../dashboard/stores/userStore";

export const UserDropdown = ({
  firstName,
  avatar,
  className,
  userId,
}: {
  firstName: string;
  avatar?: string | null;
  className?: string;
  userId: string;
}) => {
  const { setData, data } = useUserDataStore();
  useEffect(() => {
    if (data !== userId) setData(userId);
  }, [data]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        {/* eslint @next/next/no-img-element:off */}
        <PersonIcon className="h-7 w-7 rounded-full border-2 border-primary p-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-muted-foreground">
          {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer text-muted-foreground" asChild>
            <Link href={Paths.FCR}>Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-muted-foreground" asChild>
            <Link href={Paths.Billing}>Billing</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-muted-foreground" asChild>
            <Link href={Paths.Settings}>Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="p-0">
          <SignoutConfirmation />
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SignoutConfirmation = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast("Signed out successfully", {
        position: "top-center",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message, {
          icon: <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />,
          position: "top-center",
        });
      }
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className="px-2 py-1.5 text-sm text-muted-foreground outline-none"
        asChild
      >
        <button>Sign out</button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Sign out from {APP_TITLE}?</AlertDialogTitle>
          <AlertDialogDescription>You will be redirected to the home page.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <LoadingButton loading={isLoading} onClick={handleSignout}>
            Continue
          </LoadingButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
