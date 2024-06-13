"use client";

import { CreditCard, HistoryIcon } from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
const items: MenuItemProps[] = [
  {
    title: "Daily FCR",
    href: "/dashboard/fcr",
    subs: [
      {
        title: "New",
        href: "/dashboard/fcr/new",
      },
      { title: "History", href: "/dashboard/fcr/history", icon: HistoryIcon },
      { title: "Standards", href: "/dashboard/fcr/standards", icon: HistoryIcon },
    ],
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    subs: [
      {
        title: "Company",
        href: "/dashboard/billing/company",
      },
      { title: "Farmer", href: "/dashboard/billing/farmer", icon: HistoryIcon },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
  },
];

interface MenuItemProps {
  title: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subs?: MenuItemProps[];
}
interface ItemStates {
  [key: string]: boolean;
}
const MenuItem: React.FC<MenuItemProps> = ({ href, title, icon, subs }) => {
  const path = usePathname();
  const hasSubs = subs && subs.length > 0;
  const isCurrentPath = path === href;
  const [itemStates, setItemStates] = useState<ItemStates>({});
  // console.log(path);
  // Function to toggle the state of an item
  const toggleItem = (itemName: string) => {
    setItemStates((prevState) => ({
      ...prevState,
      [itemName]: !prevState[itemName], // Toggle the boolean value
    }));
  };
  return (
    <>
      {hasSubs ? (
        <div className="flex flex-col">
          <Accordion type="single" collapsible defaultValue={title} className="hidden md:flex">
            <AccordionItem
              value={title}
              className={cn(
                "hover:text-accent- w-full rounded-t-md border-b-2 border-primary px-2 text-xs font-medium hover:bg-accent sm:text-sm",
                path.includes(href)
                  ? "border-destructive-foreground bg-accent"
                  : "transparent open",
                !itemStates[title] ? "border-0" : "",
              )}
            >
              <AccordionTrigger onClick={() => toggleItem(title)} className="gap-y-2 ">
                <Link href={href}>{title}</Link>
              </AccordionTrigger>
              <AccordionContent key={href} className="mt-2 flex flex-col gap-y-2 pl-2">
                {subs?.map((subItem) => (
                  <MenuItem
                    key={subItem?.href}
                    title={subItem.title}
                    href={subItem.href}
                    subs={subItem.subs}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex md:hidden">
            <DropdownMenu key={`${href}key`}>
              <DropdownMenuTrigger>
                {/* eslint @next/next/no-img-element:off */}
                <div
                  className={cn(
                    "flex min-h-12 flex-row items-center justify-center gap-x-2 rounded-t-md border-b-2 border-primary px-2 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground sm:text-sm",
                    path.includes(href) ? "border-destructive-foreground bg-accent" : "transparent",
                  )}
                >
                  {title} <ChevronDown className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="flex w-full gap-y-2 md:hidden">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    key={href}
                    className={cn(
                      "cursor-pointer border-b-2 text-muted-foreground",
                      path === href ? "border-destructive-foreground bg-accent" : "transparent",
                    )}
                    asChild
                  >
                    <Link href={href}>{title} Dashboard</Link>
                  </DropdownMenuItem>
                  {subs?.map((subItem) => (
                    <DropdownMenuItem
                      className={cn(
                        "cursor-pointer border-b-2 text-muted-foreground",
                        path === subItem.href
                          ? "border-destructive-foreground bg-accent"
                          : "transparent",
                      )}
                      key={subItem.href}
                      asChild
                    >
                      <Link href={subItem.href}>{subItem.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        <Link href={href}>
          <span
            className={cn(
              "group flex min-h-12 items-center rounded-t-md border-b-2 border-primary px-2 py-2 text-xs font-medium hover:bg-accent hover:text-red-500 sm:text-sm md:min-h-0",
              isCurrentPath ? "border-destructive-foreground bg-accent" : "transparent",
            )}
          >
            <span>{title}</span>
          </span>
        </Link>
      )}
    </>
  );
};

interface Props {
  className?: string;
}

export function DashboardNav({ className }: Props) {
  const path = usePathname();

  return (
    <nav className={cn(className, " border-primary-foreground md:border-r-2  md:pr-8 lg:pr-10")}>
      {items.map((item) => (
        <MenuItem key={item.href} subs={item.subs} title={item.title} href={item.href} />
      ))}
    </nav>
  );
}
