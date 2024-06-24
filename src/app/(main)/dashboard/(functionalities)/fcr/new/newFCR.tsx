"use client";

import { FCRRecord } from "@/app/(main)/_types";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFCR } from "@/lib/actions/fcr/actions";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import copy from "clipboard-copy";
import { useRouter } from "next/navigation";
import { Paths } from "@/lib/constants";
import { Button } from "@/components/ui/button";
interface feed {
  name: string;
  quantity: number;
}
const FCR = () => {
  const router = useRouter();
  const [state, formAction] = useFormState(createFCR, null);
  const initialFcrObj: FCRRecord = {
    age: 1,
    avgWeight: 320,
    date: "",
    disease: "None",
    farmer: "",
    farmStock: [
      { name: "B1", quantity: 0 },
      { name: "B2", quantity: 0 },
    ],
    fcr: 0,
    location: "",
    medicine: "None",
    stdFcr: 0,
    stdWeight: 0,
    strain: "Ross A",
    todayMortality: 0,
    totalDoc: 0,
    totalFeed: [
      { name: "B1", quantity: 0 },
      { name: "B2", quantity: 0 },
    ],
    totalMortality: 0,
  };
  const [fcrObj, setFcrObj] = useState<FCRRecord>(initialFcrObj);
  const ref = useRef<HTMLDivElement>(null);
  const [msg, setMsg] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [feed, setFeed] = useState<feed[]>([
    { name: "B1", quantity: 0 },
    { name: "B2", quantity: 0 },
  ]);

  const [stock, setStock] = useState<feed[]>([
    { name: "B1", quantity: 0 },
    { name: "B2", quantity: 0 },
  ]);
  const handleInputChange = (field: keyof FCRRecord, value: string, index?: number) => {
    console.log(field);
    if (field === "totalFeed" || field === "farmStock") {
      if (index !== undefined) {
        const updatedArray = fcrObj[field].map((item, i) =>
          i === index ? { ...item, quantity: Number(value) } : item,
        );

        setFcrObj({ ...fcrObj, [field]: updatedArray });
        console.log(updatedArray);
      }
    } else {
      const updatedData = {
        ...fcrObj,
        [field]: value,
      };
      console.log(updatedData);
      setFcrObj(updatedData);
    }
  };
  useEffect(() => {
    try {
      if (state?.success) {
        const newObj: FCRRecord = JSON.parse(state.success.toString()) as FCRRecord;
        const formattedDate = format(new Date(newObj.date), "dd-MM-yyyy HH:mm:ss");
        const formattedObj = { ...newObj, date: formattedDate };
        console.log(formattedDate);
        console.log(formattedObj.date);
        let feedCount = 0;
        let stockCount = 0;
        formattedObj.totalFeed.map((feed) => {
          feedCount += feed.quantity;
        });
        formattedObj.farmStock.map((stock) => {
          stockCount += stock.quantity;
        });
        setFcrObj(formattedObj);
        const msg = `\n
    Date: ${formattedObj.date.substring(0, formattedObj.date.indexOf(" "))}\n
    Farmer: ${formattedObj.farmer}\n
    Location: ${formattedObj.location}\n
    Total DOC Input: ${formattedObj.totalDoc}\n
    Strain: ${formattedObj.strain}\n
    Age: ${formattedObj.age} days \n\n
    Today Mortality:${formattedObj.todayMortality} pcs\n
    Total Mortality: ${formattedObj.totalMortality} pcs\n
    Avg. Wt: ${formattedObj.avgWeight} gm \n
    Std. Wt: ${formattedObj.stdWeight} gm\n
    FCR: ${formattedObj.fcr}\n
    Std FCR: ${formattedObj.stdFcr}\n
    \n
    Total Feed: ${feedCount + 1 > 1 ? feedCount + 1 + " bags" : feedCount + 1 + " bag"} running\n
    ${formattedObj.totalFeed
      .map((feed: feed) => {
        return `${feed.name}: ${feed.quantity} bags\n\n`;
      })
      .join("    ")} 
    Total Stock: ${stockCount} bags \n
    ${formattedObj.farmStock
      .map((stock: feed) => {
        return `${stock.name}: ${stock.quantity} bags\n\n`;
      })
      .join("    ")}
    Disease: ${formattedObj.disease}\n
    Medicine: ${formattedObj.medicine}
    `;
        setMsg(msg);
        setVisible(true);
      }
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (error) {
      console.log(error);
    }
  }, [state?.success]);
  // useEffect(() => {
  //   if (JSON.stringify(fcrObj) === JSON.stringify(initialFcrObj)) {
  //     setVisible(false);
  //   } else {

  //   }
  // }, [fcrObj]);
  return (
    <div className="flex w-full flex-col items-start justify-center gap-y-8 md:gap-x-8 xl:flex-row">
      <Card className="w-full max-w-xl">
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="flex flex-col items-start justify-start space-y-4">
              <div className="mb-2 mt-8 flex gap-x-8">
                <div className="space-y-2">
                  <Label>Farmer Name</Label>
                  <Input
                    name="farmerName"
                    required
                    autoComplete="farmerName"
                    placeholder="Nafi"
                    value={fcrObj.farmer}
                    onChange={(e) => {
                      handleInputChange("farmer", e.target.value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    name="location"
                    required
                    autoComplete="location"
                    placeholder="Bhaluka"
                    value={fcrObj.location}
                    onChange={(e) => {
                      handleInputChange("location", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Total DOC</Label>
              <Input
                required
                placeholder="1000"
                autoComplete="totalDoc"
                name="totalDoc"
                type="string"
                value={fcrObj.totalDoc}
                onChange={(e) => {
                  handleInputChange("totalDoc", e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Strain</Label>
              <Input
                required
                placeholder="Ross A"
                autoComplete="strain"
                name="strain"
                type="text"
                value={fcrObj.strain}
                onChange={(e) => {
                  handleInputChange("strain", e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Age (in days)</Label>
              <Input
                required
                placeholder="1"
                autoComplete="age"
                name="age"
                value={fcrObj.age}
                onChange={(e) => {
                  handleInputChange("age", e.target.value);
                }}
                type="string"
              />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Label className="text-center text-lg font-bold">Mortality</Label>
              <div className="flex h-full w-full flex-row space-x-2">
                <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                  <Label>Today</Label>
                  <Input
                    required
                    placeholder="0"
                    autoComplete="todayMortality"
                    name="todayMortality"
                    value={fcrObj.todayMortality}
                    onChange={(e) => {
                      handleInputChange("todayMortality", e.target.value);
                    }}
                    type="string"
                  />
                </div>
                <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                  <Label>Total</Label>
                  <Input
                    required
                    placeholder="0"
                    autoComplete="totalMortality"
                    name="totalMortality"
                    value={fcrObj.totalMortality}
                    onChange={(e) => {
                      handleInputChange("totalMortality", e.target.value);
                    }}
                    type="string"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Average Weight (in gm)</Label>
              <Input
                required
                placeholder="1"
                autoComplete="avgWeight"
                name="avgWeight"
                type="string"
                value={fcrObj.avgWeight}
                onChange={(e) => {
                  handleInputChange("avgWeight", e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Label className="text-center text-lg font-bold">Total Feed</Label>
              <div className="flex h-full w-full flex-row space-x-2">
                <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                  <Label>510</Label>
                  <Input
                    required
                    placeholder="0"
                    type="string"
                    value={fcrObj.totalFeed[0]?.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("totalFeed", e.target.value, 0)
                    }
                  />
                </div>
                <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                  <Label>511</Label>
                  <Input
                    required
                    placeholder="0"
                    type="string"
                    value={fcrObj.totalFeed[1]?.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("totalFeed", e.target.value, 1)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Label className="text-center text-lg font-bold">Farm Stock</Label>
              <div className="flex h-full w-full flex-row space-x-2">
                <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                  <Label>510</Label>
                  <Input
                    required
                    placeholder="0"
                    type="string"
                    value={fcrObj.farmStock[0]?.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("farmStock", e.target.value, 0)
                    }
                  />
                </div>
                <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                  <Label>511</Label>
                  <Input
                    required
                    placeholder="0"
                    type="string"
                    value={fcrObj.farmStock[1]?.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("farmStock", e.target.value, 1)
                    }
                  />
                </div>
              </div>
            </div>
            <Input value={JSON.stringify(feed)} name="totalFeed" readOnly className="hidden" />
            <Input value={JSON.stringify(stock)} name="farmStock" readOnly className="hidden" />
            <div className="space-y-2">
              <Label>Disease</Label>
              <Input
                required
                placeholder="None"
                autoComplete="disease"
                name="disease"
                type="text"
                defaultValue={"None"}
              />
            </div>
            <div className="space-y-2">
              <Label>Medicine</Label>
              <Input
                required
                placeholder="None"
                autoComplete="medicine"
                name="medicine"
                type="text"
                defaultValue={"None"}
              />
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

            <SubmitButton className="w-full"> Calculate</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card className={`${visible ? "block" : "hidden"} w-full max-w-xl`}>
        <CardContent>
          <div
            ref={ref}
            onClick={async () => {
              const dataToCopy = msg;
              const stringWithoutConsecutiveNewlines = dataToCopy.replace(/\n(?!\n)/g, "");
              const stringWithoutSpaces = stringWithoutConsecutiveNewlines
                .split("\n")
                .map((line) => line.trim())
                .join("\n");
              // console.log(stringWithoutSpaces);
              await copy(stringWithoutSpaces);
              toast("Message copied to clipboard");
            }}
            className={`m-4 mt-8 transform animate-color-change items-center justify-center whitespace-break-spaces rounded-lg bg-white p-4 pl-10 text-start leading-[.75] text-black shadow-2xl transition duration-300 hover:scale-105`}
          >
            {msg}
          </div>
          <Button
            className="w-full font-semibold"
            onClick={() => {
              setVisible(false);
              setFcrObj(initialFcrObj);
            }}
          >
            Clear
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default FCR;
