export interface OrganizationType {
  id: string;
  name: string;
}
export interface OrganizationsType {
  organizations?: OrganizationType[];
  currentOrg?: string;
}
export type feed = {
  name: string;
  quantity: number;
};
export interface FCRRecord {
  farmer?: string;
  age: number;
  avgWeight: number;
  disease: string;
  fcr: number;
  stdFcr: number;
  stdWeight: number;
  location: string;
  medicine: string;
  strain: string;
  todayMortality: number;
  totalMortality: number;
  totalDoc: number;
  farmStock: feed[];
  totalFeed: feed[];
  createdAt?: Date;
}
export type StandardData = {
  age: number;
  stdWeight: number;
  stdFcr: number;
  organization?: string;
};

export type CyclesData = {
  farmerName: string;
  farmerLocation: string;
  farmerId: string;
  id: string;
  totalDoc: number | null;
  strain: string | null;
  age: number | null;
  ended: boolean | null;
  endDate: Date | null;
  startDate: Date | null;
  createdBy: { firstName: string; lastName: string; email: string; id: string };
  lastFCR: {
    totalFeed: feed[];
    farmStock: feed[];
    id: string;
    createdAt: Date;
    fcr: number;
    stdFcr: number;
    stdWeight: number;
    avgWeight: number;
    age: number;
    totalMortality: number;
    lastDayMortality: number;
  } | null;
};
