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
      { title: "Standards", href: "/dashboard/fcr/standards" },
    ],
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
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
                "w-full rounded-t-md border-b-2 border-primary px-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                isCurrentPath ? "border-destructive-foreground bg-accent" : "transparent open",
                !itemStates[title] ? "border-0" : "",
              )}
            >
              <AccordionTrigger onClick={() => toggleItem(title)} className="gap-x-2 ">
                <Link href={href}>{title}</Link>
              </AccordionTrigger>
              <AccordionContent className="pl-2">
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                {/* eslint @next/next/no-img-element:off */}
                <div
                  className={cn(
                    "flex flex-row gap-x-2 rounded-t-md border-b-2 border-primary px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isCurrentPath ? "border-destructive-foreground bg-accent" : "transparent",
                    !itemStates[title] ? "border-red-500" : "",
                  )}
                >
                  {title} <ChevronDown />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="flex w-full md:hidden">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer text-muted-foreground" asChild>
                    <Link href={href}>{title} Dashboard</Link>
                  </DropdownMenuItem>
                  {subs?.map((subItem) => (
                    <DropdownMenuItem className="cursor-pointer text-muted-foreground" asChild>
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
              "group flex items-center rounded-t-md border-b-2 border-primary px-2 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
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
    <nav className={cn(className, "border-r-2 border-primary-foreground sm:pr-12")}>
      {items.map((item) => (
        <MenuItem key={item.href} subs={item.subs} title={item.title} href={item.href} />
      ))}
    </nav>
  );
}
