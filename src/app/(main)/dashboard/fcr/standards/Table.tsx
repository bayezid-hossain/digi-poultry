"use client";
import React from "react";
import { StandardData, columns } from "./_components/columns";
import { DataTable } from "./_components/DataTable";

export const standards: StandardData[] = [
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
const StandardsTable = () => {
  return (
    <div className="w-full max-w-4xl">
      <DataTable data={standards} columns={columns} />
    </div>
  );
};

export default StandardsTable;
