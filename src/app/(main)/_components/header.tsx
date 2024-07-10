import Link from "next/link";
import { MagicWandIcon, RocketIcon } from "@/components/icons";
import { APP_TITLE } from "@/lib/constants";
import { UserDropdown } from "@/app/(main)/_components/user-dropdown";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import OrganizationDropdown from "./organization-dropdown";
import { OrganizationsType } from "../_types";
import NotificationDropDown from "./notification-dropdown";
import { api } from "@/trpc/server";

export const Header = async ({ organizations, currentOrg }: OrganizationsType) => {
  const { user } = await validateRequest();

  const notifications = await api.user.getNotifications.query();
  return (
    <header className="sticky top-0 z-10 border-b p-0 backdrop-blur-md">
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
            <div className="flex gap-x-4">
              <NotificationDropDown userId={user.id} notifications={notifications ?? []} />
              <UserDropdown firstName={user.firstName} avatar={user.avatar} />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};
