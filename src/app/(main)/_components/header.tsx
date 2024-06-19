import Link from "next/link";
import { MagicWandIcon, RocketIcon } from "@/components/icons";
import { APP_TITLE } from "@/lib/constants";
import { UserDropdown } from "@/app/(main)/_components/user-dropdown";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import OrganizationDropdown from "./organization-dropdown";
import { OrganizationsType } from "../_types";

export const Header = async ({ organizations, currentOrg }: OrganizationsType) => {
  const { user } = await validateRequest();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 p-0">
      <div className="container flex items-center gap-2 px-2 py-2 lg:px-4">
        <Link className="flex items-center justify-center text-xl font-medium" href="/">
          <MagicWandIcon className="mr-2 h-5 w-5" /> <p className="hidden md:block">{APP_TITLE}</p>
        </Link>
        {user ? (
          <div className=" ml-auto flex items-center justify-center gap-x-3">
            {organizations && currentOrg ? (
              <div>
                <OrganizationDropdown organizations={organizations} currentOrg={currentOrg} />
              </div>
            ) : null}
            <UserDropdown firstName={user.firstName} avatar={user.avatar} />
          </div>
        ) : null}
      </div>
    </header>
  );
};
