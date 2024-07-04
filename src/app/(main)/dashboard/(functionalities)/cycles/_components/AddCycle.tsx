import React, { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";

import { CreateCycle } from "@/lib/actions/cycle/actions";

import { ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import AddFarmerDialog from "../../farmers/_components/AddFarmer";
import { FarmerData } from "../../farmers/Farmers";
import useFarmerDataStore from "../../../stores/farmerStore";
import useCycleDataStore from "../../../stores/cycleStore";
import { farmer } from "@/server/db/schema";
import { CyclesData } from "@/app/(main)/_types";

const AddCycle = () => {
  const [state, formAction] = useFormState(CreateCycle, null);
  const [open, setOpen] = useState<boolean>(false);
  const [popOpen, setPopOpen] = useState<boolean>(false);
  const { data: farmers } = useFarmerDataStore();
  const { addData: addCycle } = useCycleDataStore();
  const [selectedFarmer, selectFarmer] = useState<FarmerData>();
  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      const obj = JSON.parse(state?.success?.toString() ?? "{}") as CyclesData;
      addCycle(obj);
    }
  }, [state?.success]);
  return (
    <div className="flex w-full flex-row items-center justify-start">
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild>
          <Button variant="outlineLink" className="w-full">
            Create Cycle
          </Button>
        </DialogTrigger>
        <DialogContent
          onClick={(e) => {
            setOpen(true);
          }}
          className="mb-auto sm:max-w-[425px] "
        >
          <DialogHeader>
            <DialogTitle>Create a Cycle for your Organization</DialogTitle>
            <DialogDescription>
              Please provide input for Cycle Data, click "Create" to add it to the server.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            <Popover open={popOpen} onOpenChange={setPopOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {selectedFarmer ? selectedFarmer.name : "Select Farmer..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search Farmer..." />
                  <CommandList>
                    <CommandEmpty>No Farmer found.</CommandEmpty>
                    <CommandGroup>
                      {farmers.map((farmer) => (
                        <CommandItem
                          key={farmer.id}
                          value={farmer.name + farmer.id}
                          onSelect={async (currentValue: string) => {
                            const farmerId = currentValue.replace(farmer.name, "");
                            selectFarmer(farmer);
                            setPopOpen(false);
                          }}
                        >
                          <div
                            className="grid w-full grid-cols-3 place-items-center 
                          "
                          >
                            <span>{farmer.name}</span>
                            <span>-</span>
                            <span>{farmer.location}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandItem key={"create-new-farmer"}>
                      <AddFarmerDialog />
                    </CommandItem>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="grid grid-rows-2 items-center gap-4">
                <Label htmlFor="totalDoc" className="text-left">
                  Total DOC
                </Label>
                <Input
                  id="totalDoc"
                  name="totalDoc"
                  required
                  type="text"
                  placeholder="Total DOC"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-rows-2 items-center gap-4">
                <Input defaultValue={selectedFarmer?.id} className="hidden" name="farmerId" />
                <Label htmlFor="location" className="text-left">
                  Age
                </Label>
                <Input
                  id="age"
                  type="text"
                  name="age"
                  required
                  defaultValue={0}
                  placeholder="Age"
                  className="col-span-3"
                />
              </div>{" "}
              <div className="grid grid-rows-2 items-center gap-4">
                <Label htmlFor="totalMortality" className="text-left">
                  Total Mortality
                </Label>
                <Input
                  id="totalMortality"
                  name="totalMortality"
                  required
                  type="text"
                  defaultValue={0}
                  placeholder="Total Mortality"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-rows-2 items-center gap-4">
                <Label htmlFor="Strain" className="text-left">
                  Strain
                </Label>
                <Input
                  id="Strain"
                  type="text"
                  name="Strain"
                  required
                  defaultValue={"Ross A"}
                  placeholder="Age"
                  className="col-span-3"
                />
              </div>
            </div>
            {state?.fieldError ? (
              <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
                {Object.values(state.fieldError).map((err) => (
                  <li className="ml-4" key={err}>
                    {err}
                  </li>
                ))}
              </ul>
            ) : state?.formError ? (
              <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
                {state?.formError}
              </p>
            ) : null}
            <DialogFooter>
              <SubmitButton className="w-full"> Add</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddCycle;
