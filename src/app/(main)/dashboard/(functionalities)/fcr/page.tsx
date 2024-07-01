import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  return (
    <div className="h-full w-full">
      <div className="mb-6 flex flex-col gap-y-4">
        <h1 className="text-3xl font-bold md:text-4xl">Daily FCR</h1>
        <p className="text-sm text-muted-foreground">Manage your FCRs here</p>
        <hr className="mt-2 border-t-[1px] border-primary"></hr>
        <div className=" flex w-full flex-row items-center justify-end gap-x-8 p-2 ">
          <Button>
            <Link href={"/dashboard/fcr/new"}>New</Link>
          </Button>
          <Button>View All</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
