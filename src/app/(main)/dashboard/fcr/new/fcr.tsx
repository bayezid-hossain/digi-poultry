"use client";

import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFCR } from "@/lib/fcr/actions";
import { useFormState } from "react-dom";

const FCR = () => {
  const [state, formAction] = useFormState(createFCR, null);

  return (
    <Card className="w-full max-w-xl">
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="flex flex-col items-start justify-start space-y-4">
            <div className="mb-2 mt-8 flex gap-x-8">
              <div className="space-y-2">
                <Label>Farmer Name</Label>
                <Input name="farmerName" required autoComplete="farmerName" placeholder="Nafi" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input name="location" required autoComplete="location" placeholder="Bhaluka" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Total DOC</Label>
            <Input
              required
              placeholder="1000"
              autoComplete="totalDOC"
              name="totalDOC"
              type="number"
            />
          </div>
          <div className="space-y-2">
            <Label>Strain</Label>
            <Input required placeholder="Ross A" autoComplete="strain" name="strain" type="text" />
          </div>
          <div className="space-y-2">
            <Label>Age (in days)</Label>
            <Input required placeholder="1" autoComplete="age" name="age" type="number" />
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
                  type="number"
                />
              </div>
              <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                <Label>Total</Label>
                <Input
                  required
                  placeholder="0"
                  autoComplete="totalMortality"
                  name="totalMortality"
                  type="number"
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
              type="number"
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
                  autoComplete="feed510"
                  name="feed510"
                  type="number"
                />
              </div>
              <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                <Label>511</Label>
                <Input
                  required
                  placeholder="0"
                  autoComplete="feed511"
                  name="feed511"
                  type="number"
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
                  autoComplete="stock510"
                  name="stock510"
                  type="number"
                />
              </div>
              <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
                <Label>511</Label>
                <Input
                  required
                  placeholder="0"
                  autoComplete="stock511"
                  name="stock511"
                  type="number"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Disease</Label>
            <Input required placeholder="None" autoComplete="disease" name="disease" type="text" />
          </div>
          <div className="space-y-2">
            <Label>Medicine</Label>
            <Input
              required
              placeholder="None"
              autoComplete="medicine"
              name="medicine"
              type="text"
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
  );
};
export default FCR;
