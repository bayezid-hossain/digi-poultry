import { ExclamationTriangleIcon } from "@/components/icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import Link from "next/link";
import { CreateOrganization } from "./create-organization";

export async function OrganizationWarning() {
  const { session } = await validateRequest();

  return !session?.organization ? (
    <Alert className="rounded-lg bg-yellow-50 text-yellow-700 dark:bg-gray-800 dark:text-yellow-400">
      <ExclamationTriangleIcon className="h-5 w-5 !text-yellow-700 dark:!text-yellow-400" />
      <div className="flex lg:items-center">
        <div className="w-full">
          <AlertTitle>Organization Required</AlertTitle>
          <AlertDescription>
            Please create an organization or get invited by one to get started.
          </AlertDescription>
        </div>
        <CreateOrganization />
      </div>
    </Alert>
  ) : null;
}
