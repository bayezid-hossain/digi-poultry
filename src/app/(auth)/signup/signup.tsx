"use client";

import { PasswordInput } from "@/components/password-input";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/actions/auth/actions";
import { APP_TITLE } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

export function Signup() {
  const [state, formAction] = useFormState(signup, null);

  const [userType, setuserType] = useState<string>("farmer");
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{APP_TITLE}</CardTitle>
        <CardDescription>Signup to starting digitalizing your farm!</CardDescription>
      </CardHeader>
      <CardHeader className="items-center justify-center p-2">
        <Image
          src={"/assets/logo.jpg"}
          width={150}
          height={150}
          quality={100}
          className="rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10"
          alt="logo"
        />
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="flex flex-col items-start justify-start space-y-4">
            <div className="mb-2 mt-8 flex gap-x-8">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input name="firstName" required autoComplete="firstName" placeholder="Bayezid" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input name="lastName" required autoComplete="firstName" placeholder="Bayezid" />
              </div>
            </div>
            <Label className="mt-4">What&apos;s your role?</Label>
            <DropdownMenu>
              <div className="flex w-full items-center justify-start">
                <p className="mr-2">
                  I am {userType === "company" ? "representing " : ""} a
                  {userType === "investor" ? "n" : ""}
                </p>
                <DropdownMenuTrigger className="border-2 border-primary/80 px-2">
                  {userType}
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup value={userType} onValueChange={setuserType}>
                  <DropdownMenuRadioItem value="farmer">Farmer</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="company">Company</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="investor">Investor</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
              <input type="hidden" name="userType" value={userType} />
            </DropdownMenu>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              required
              placeholder="email@example.com"
              autoComplete="email"
              name="email"
              type="email"
            />
          </div>{" "}
          <div className="space-y-2">
            <Label>Password</Label>
            <PasswordInput
              name="password"
              required
              autoComplete="current-password"
              placeholder="********"
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
          <div>
            <Link href={"/login"}>
              <span className="p-0 text-xs font-medium underline-offset-4 hover:underline">
                Already signed up? Login instead.
              </span>
            </Link>
          </div>
          <SubmitButton className="w-full"> Sign Up</SubmitButton>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
