"use client";
import * as React from "react";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFormState } from "react-dom";
import { ChangeOrganization } from "@/lib/actions/organization/actions";
import { useRouter } from "next/navigation";
import { CreateOrganization } from "../dashboard/_components/create-organization";
import { OrganizationsType } from "../_types";

const OrganizationDropdown = ({ organizations, currentOrg }: OrganizationsType) => {
  if (!organizations || !currentOrg) return <div>Nothing to show</div>;
  const [changing, setChanging] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const router = useRouter();
  React.useEffect(() => {
    setValue(currentOrg);
    setChanging(false);
  }, [currentOrg]);
  return (
    <div>
      {changing ? (
        <div className="fixed left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-y-8 bg-slate-800 ">
          <Loader2 className="z-20 animate-spin" />
          <p className="z-20 animate-pulse">Changing Workspace</p>
        </div>
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? organizations.find((organization) => organization.id === value)?.name
              : "Select organization..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search organization..." />
            <CommandList>
              <CommandEmpty>No organization found.</CommandEmpty>
              <CommandGroup>
                {organizations.map((organization) => (
                  <CommandItem
                    key={organization.id}
                    value={organization.id}
                    onSelect={async (currentValue: string) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      setChanging(true);
                      const formData = new FormData();
                      formData.append("orgId", currentValue);
                      const result = await ChangeOrganization(null, formData, false);
                      router.refresh();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === organization.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {organization.name}
                  </CommandItem>
                ))}
                <CommandItem key={"create-new-org"}>
                  <CreateOrganization />
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OrganizationDropdown;
