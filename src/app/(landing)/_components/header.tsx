import Link from "next/link";
import { RocketIcon } from "@/components/icons";
import { APP_TITLE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HamburgerMenuIcon, MagicWandIcon } from "@radix-ui/react-icons";
import { SubmitButton } from "@/components/submit-button";
import { logout } from "@/lib/auth/actions";
import { validateRequest } from "@/lib/auth/validate-request";

const routes = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
] as const;

export const Header = async () => {
  const { user } = await validateRequest();
  return (
    <header className="sticky top-0 z-10 mb-4 w-full border-b bg-background/80 p-0">
      <div className="container my-2 flex items-center gap-2 p-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="focus:outline-none focus:ring-1 md:hidden"
              size="icon"
              variant="outline"
            >
              <HamburgerMenuIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <div className="py-1">
              {routes.map(({ name, href }) => (
                <DropdownMenuItem key={name} asChild>
                  <Link href={href}>{name}</Link>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link className="flex items-center justify-center text-xl font-medium" href="/">
          <MagicWandIcon className="mr-2 h-5 w-5" /> <p className="hidden md:block">{APP_TITLE}</p>{" "}
          Dashboard
        </Link>
        <nav className="ml-10 hidden gap-4 sm:gap-6 md:flex">
          {routes.map(({ name, href }) => {
            if (name === "Dashboard" && user) {
              return (
                <Button key={name} asChild variant={"link"}>
                  <Link key={name} href={href}>
                    {name}
                  </Link>
                </Button>
              );
            } else if (name !== "Dashboard") {
              return (
                <Button key={name} asChild variant={"link"}>
                  <Link key={name} href={href}>
                    {name}
                  </Link>
                </Button>
              );
            }
          })}
        </nav>
        {!user && (
          <div className="ml-auto flex gap-x-4">
            <Button asChild variant={"outlineLink"}>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant={"outlineLink"}>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
        {user && (
          <form action={logout} className="ml-auto">
            <SubmitButton variant="outline">Logout</SubmitButton>
          </form>
        )}
      </div>
    </header>
  );
};
