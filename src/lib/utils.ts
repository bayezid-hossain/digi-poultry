import { env } from "@/env";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getExceptionType = (error: unknown) => {
  const UnknownException = {
    type: "UnknownException",
    status: 500,
    message: "An unknown error occurred",
  };

  if (!error) return UnknownException;

  if ((error as Record<string, unknown>).name === "DatabaseError") {
    return {
      type: "DatabaseException",
      status: 400,
      message: "Duplicate key entry",
    };
  }

  return UnknownException;
};

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
) {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
  }).format(new Date(date));
}

export function formatPrice(price: number | string, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: options.currency ?? "USD",
    notation: options.notation ?? "compact",
    ...options,
  }).format(Number(price));
}

export function absoluteUrl(path: string) {
  return new URL(path, env.NEXT_PUBLIC_APP_URL).href;
}

export function processFieldErrors(error: ZodError): string {
  const flattenedErrors = error.flatten().fieldErrors;
  for (const key in flattenedErrors) {
    console.log(flattenedErrors[key.toString()]);
    return flattenedErrors[key.toString()]?.toString() || "";
  }

  return "";
}
