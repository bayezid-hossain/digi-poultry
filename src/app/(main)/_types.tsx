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
  date?: string;
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
  id: string;
  totalDoc: number;
  strain: string | null;
  age: number;
  ended: boolean | null;
  endDate: Date | null;
  startDate: Date;
  farmerId: string;

  createdBy: { firstName: string; lastName: string; email: string; id: string };
  lastFCR: {
    id: string;
    createdAt: Date;
    totalMortality: number;
    stdFcr: number;
    stdWeight: number;
    lastDayMortality: number;
    fcr: number;
    avgWeight: number;
    age: number;
    farmStock: feed[];
    totalFeed: feed[];
  } | null;
};
