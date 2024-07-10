import { FCRRecord, StandardData, feed } from "@/app/(main)/_types";
import { env } from "@/env";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import type { ZodError } from "zod";

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
  date: Date | string | number | null,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
) {
  try {
    return new Intl.DateTimeFormat(["ban"], {
      ...options,
    }).format(new Date(date ?? Date.now()));
  } catch (e) {
    console.log(e);
    console.log(date);
    return new Intl.DateTimeFormat(["ban"], {
      ...options,
      month: "numeric",
    }).format(Date.now());
  }
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
    // console.log(flattenedErrors[key.toString()]);
    return flattenedErrors[key.toString()]?.toString() ?? "";
  }

  return "";
}
export const standardData: StandardData[] = [
  { age: 1, stdWeight: 61, stdFcr: 0.207 },
  { age: 2, stdWeight: 79, stdFcr: 0.37 },
  { age: 3, stdWeight: 100, stdFcr: 0.499 },
  { age: 4, stdWeight: 123, stdFcr: 0.601 },
  { age: 5, stdWeight: 148, stdFcr: 0.682 },
  { age: 6, stdWeight: 177, stdFcr: 0.749 },
  { age: 7, stdWeight: 209, stdFcr: 0.803 },
  { age: 8, stdWeight: 244, stdFcr: 0.848 },
  { age: 9, stdWeight: 283, stdFcr: 0.887 },
  { age: 10, stdWeight: 325, stdFcr: 0.92 },
  { age: 11, stdWeight: 370, stdFcr: 0.949 },
  { age: 12, stdWeight: 419, stdFcr: 0.975 },
  { age: 13, stdWeight: 471, stdFcr: 0.999 },
  { age: 14, stdWeight: 527, stdFcr: 1.021 },
  { age: 15, stdWeight: 586, stdFcr: 1.042 },
  { age: 16, stdWeight: 648, stdFcr: 1.062 },
  { age: 17, stdWeight: 714, stdFcr: 1.082 },
  { age: 18, stdWeight: 782, stdFcr: 1.101 },
  { age: 19, stdWeight: 854, stdFcr: 1.12 },
  { age: 20, stdWeight: 928, stdFcr: 1.138 },
  { age: 21, stdWeight: 1006, stdFcr: 1.157 },
  { age: 22, stdWeight: 1085, stdFcr: 1.175 },
  { age: 23, stdWeight: 1168, stdFcr: 1.193 },
  { age: 24, stdWeight: 1252, stdFcr: 1.212 },
  { age: 25, stdWeight: 1339, stdFcr: 1.23 },
  { age: 26, stdWeight: 1428, stdFcr: 1.248 },
  { age: 27, stdWeight: 1518, stdFcr: 1.267 },
  { age: 28, stdWeight: 1661, stdFcr: 1.285 },
  { age: 29, stdWeight: 1704, stdFcr: 1.304 },
  { age: 30, stdWeight: 1799, stdFcr: 1.32 },
  { age: 31, stdWeight: 1895, stdFcr: 1.341 },
  { age: 32, stdWeight: 1992, stdFcr: 1.36 },
];

export const generateFCRMessage = (fcrObj: FCRRecord) => {
  const formattedDate = format(new Date(fcrObj.createdAt ?? ""), "dd-MM-yyyy");
  const formattedObj = { ...fcrObj, date: formattedDate };
  let feedCount = 0;
  let stockCount = 0;
  formattedObj.totalFeed.map((feed) => {
    feedCount += feed.quantity;
  });
  formattedObj.farmStock.map((stock) => {
    stockCount += stock.quantity;
  });
  const msg = `\n
    Date: ${formattedObj.date}\n
    Farmer: ${formattedObj.farmer}\n
    Location: ${formattedObj.location}\n
    Total DOC Input: ${formattedObj.totalDoc}\n
    Strain: ${formattedObj.strain}\n
    Age: ${formattedObj.age} days \n\n
    Today Mortality: ${formattedObj.todayMortality} pcs\n
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
  return msg;
};
export const getTimeDifference = (startDate: Date): string => {
  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerWeek = msPerDay * 7;

  const differenceInMs = Date.now() - startDate.getTime();

  if (differenceInMs >= msPerWeek) {
    const days = Math.floor(differenceInMs / msPerDay);
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (differenceInMs >= msPerDay) {
    const days = Math.floor(differenceInMs / msPerDay);
    const hours = Math.floor((differenceInMs % msPerDay) / msPerHour);
    return `${days} day${days > 1 ? "s" : ""}, ${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const hours = Math.floor(differenceInMs / msPerHour);
    const minutes = Math.floor((differenceInMs % msPerHour) / msPerMinute);
    const seconds = Math.floor((differenceInMs % msPerMinute) / msPerSecond);
    return `${hours > 0 ? `${hours} ${hours > 1 ? "s" : ""}` : ""} ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
};
