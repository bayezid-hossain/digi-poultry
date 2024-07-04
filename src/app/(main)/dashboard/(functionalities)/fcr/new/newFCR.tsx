"use client";

import { FCRRecord, StandardData } from "@/app/(main)/_types";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFCR, importStandardTable } from "@/lib/actions/fcr/actions";
import { generateFCRMessage } from "@/lib/utils";
import { api } from "@/trpc/react";
import copy from "clipboard-copy";
import { format } from "date-fns";
import { Ghost, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import useStandardDataStore from "../../../stores/standardsStore";

const FCR = ({ feeds }: { feeds?: string[] }) => {
  const {
    data: standardsFromStore,
    setData: setStandardsInStore,
    isFetching,
  } = useStandardDataStore();
  const [state, formAction] = useFormState(createFCR, null);
  const [importState, importStandardAction] = useFormState(importStandardTable, null);
  const [feedNames, setFeedNames] = useState<string[]>(feeds ?? ["B1", "B2"]);
  const initialFcrObj: FCRRecord = {
    date: new Date(Date.now()).toDateString(),
    age: 1,
    avgWeight: 320,
    disease: "None",
    farmer: "",
    farmStock: [
      { name: feedNames?.[0] ?? "Bd1", quantity: 0 },
      { name: feedNames?.[0] ?? "Bd1", quantity: 0 },
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
      { name: feedNames?.[0] ?? "Bd1", quantity: 0 },
      { name: feedNames?.[1] ?? "Bd2", quantity: 0 },
    ],
    totalMortality: 0,
  };

  const [fcrObj, setFcrObj] = useState<FCRRecord>(initialFcrObj);
  const ref = useRef<HTMLDivElement>(null);
  const fieldErrors = useRef<HTMLUListElement>(null);
  const formErrors = useRef<HTMLParagraphElement>(null);
  const [msg, setMsg] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const handleInputChange = (field: keyof FCRRecord, value: string, index?: number) => {
    if (field === "totalFeed" || field === "farmStock") {
      if (index !== undefined) {
        const updatedArray = fcrObj[field].map((item, i) =>
          i === index
            ? { ...item, quantity: Number.isNaN(Number(value)) ? 0 : Number(value) }
            : item,
        );

        setFcrObj({ ...fcrObj, [field]: updatedArray });
      }
    } else {
      if (
        field !== "strain" &&
        field !== "disease" &&
        field !== "medicine" &&
        field !== "farmer" &&
        field !== "location"
      ) {
        const updatedData = {
          ...fcrObj,
          [field]: Number.isNaN(Number(value)) ? 0 : Number(value),
        };
        setFcrObj(updatedData);
      } else {
        const updatedData = {
          ...fcrObj,
          [field]: value,
        };
        setFcrObj(updatedData);
      }
    }
  };
  useEffect(() => {
    if (!isFetching) setLoading(false);
  }, [isFetching]);
  useEffect(() => {
    try {
      if (state?.success) {
        const message = generateFCRMessage(JSON.parse(state?.success.toString()) as FCRRecord);
        setMsg(message);
        setVisible(true);
      }
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (error) {
      console.log(error);
    }
  }, [state?.success]);
  useEffect(() => {
    setVisible(false);
    if (state?.fieldError) {
      fieldErrors.current?.scrollIntoView({ behavior: "smooth" });
    }
    if (state?.formError) {
      formErrors.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state?.error, state?.fieldError, state?.formError]);

  useEffect(() => {
    if (importState?.success) {
      if (standardsFromStore.length < 1)
        setStandardsInStore(
          JSON.parse(
            importState?.success?.toString() ? importState?.success?.toString() : "[]",
          ) as StandardData[],
        );
    }
  }, [importState?.success]);
  return (
    <div>
      {standardsFromStore.length != 0 ? (
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
                      <div className="flex items-center justify-between gap-x-4">
                        {" "}
                        <Label className="w-full">Name</Label>
                        <Input
                          placeholder="Feed Name"
                          value={feedNames[0]}
                          onChange={(e) => {
                            const newFeedNames = [...feedNames];
                            newFeedNames[0] = e.target.value;
                            if (fcrObj.totalFeed[0] && fcrObj.farmStock[0]) {
                              fcrObj.totalFeed[0].name = e.target.value;
                              fcrObj.farmStock[0].name = e.target.value;
                            }
                            setFeedNames(newFeedNames);
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-x-4">
                        <Label className="w-full">Quantity</Label>
                        <Input
                          placeholder="0"
                          type="string"
                          value={fcrObj.totalFeed[0]?.quantity}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleInputChange("totalFeed", e.target.value, 0)
                          }
                        />
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                      <div className="flex items-center justify-between gap-x-4">
                        {" "}
                        <Label className="w-full">Name</Label>
                        <Input
                          placeholder="Feed Name"
                          value={feedNames[1]}
                          onChange={(e) => {
                            const newFeedNames = [...feedNames];
                            newFeedNames[1] = e.target.value;
                            if (fcrObj.totalFeed[1] && fcrObj.farmStock[1]) {
                              fcrObj.totalFeed[1].name = e.target.value;
                              fcrObj.farmStock[1].name = e.target.value;
                            }
                            setFeedNames(newFeedNames);
                          }}
                        />
                      </div>{" "}
                      <div className="flex items-center justify-between gap-x-4">
                        {" "}
                        <Label className="w-full">Quantity</Label>
                        <Input
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
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <Label className="text-center text-lg font-bold">Farm Stock</Label>
                  <div className="flex h-full w-full flex-row space-x-2">
                    <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                      <Label>{fcrObj.totalFeed[0]?.name}</Label>
                      <Input
                        placeholder="0"
                        type="string"
                        value={fcrObj.farmStock[0]?.quantity}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("farmStock", e.target.value, 0)
                        }
                      />
                    </div>
                    <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                      <Label>{fcrObj.totalFeed[1]?.name}</Label>
                      <Input
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
                <Input
                  value={JSON.stringify(fcrObj.totalFeed)}
                  name="totalFeed"
                  readOnly
                  className="hidden"
                />
                <Input
                  value={JSON.stringify(fcrObj.farmStock)}
                  name="farmStock"
                  readOnly
                  className="hidden"
                />
                <div className="space-y-2">
                  <Label>Disease</Label>
                  <Input
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
                    placeholder="None"
                    autoComplete="medicine"
                    name="medicine"
                    type="text"
                    defaultValue={"None"}
                  />
                </div>
                {state?.fieldError ? (
                  <ul
                    ref={fieldErrors}
                    className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive"
                  >
                    {Object.values(state.fieldError).map((err) => (
                      <li className="ml-4" key={err}>
                        {err}
                      </li>
                    ))}
                  </ul>
                ) : state?.formError ? (
                  <p
                    ref={formErrors}
                    className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive"
                  >
                    {state?.formError}
                  </p>
                ) : null}

                <SubmitButton
                  className="w-full"
                  onClick={() => {
                    const stdFcrWt = standardsFromStore.find(
                      (standard) => standard.age === fcrObj.age,
                    );
                    if (stdFcrWt?.stdFcr && stdFcrWt.stdWeight) {
                      let feedCalc = 1;
                      fcrObj.totalFeed.map((feed) => {
                        feedCalc += feed.quantity;
                      });
                      const fcr = Number(
                        (
                          (feedCalc * 50) /
                          ((fcrObj.totalDoc - fcrObj.totalMortality) * (fcrObj.avgWeight / 1000))
                        ).toFixed(4),
                      );
                      const updatedData = {
                        ...fcrObj,
                        stdFcr: stdFcrWt.stdFcr,
                        stdWeight: stdFcrWt.stdWeight,
                        fcr: fcr,
                      };
                      const message = generateFCRMessage(updatedData);
                      setMsg(message);
                      setVisible(true);
                      setFcrObj(updatedData);
                      setTimeout(() => {
                        ref.current?.scrollIntoView({ behavior: "smooth" });
                      }, 200);
                    }
                  }}
                >
                  {" "}
                  Calculate
                </SubmitButton>
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
      ) : (
        <div>
          {loading ? (
            <div className="fixed left-1/2 top-0 flex h-full  w-full max-w-xl flex-col items-center justify-center backdrop-blur-3xl sm:h-full md:max-w-2xl xl:max-w-3xl ">
              <div>
                <Loader2 className="flex animate-spin items-center justify-center" />
              </div>
            </div>
          ) : (
            <div>
              <div className="my-8 flex h-full w-full flex-col items-center justify-center gap-2">
                <Ghost className="h-8 w-8 text-zinc-800" />
                <h3 className="text-xl font-semibold">
                  You don&apos;t have any Standards Set to Calculate FCR
                </h3>
                <p>Please insert your standards Data</p>
                <p className="text-xs font-semibold">Or</p>
                <form action={importStandardAction}>
                  {" "}
                  <SubmitButton> Import our standard values!</SubmitButton>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default FCR;
