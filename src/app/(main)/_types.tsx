export interface OrganizationType {
  id: string;
  name: string;
}
export interface OrganizationsType {
  organizations?: OrganizationType[];
  currentOrg?: string;
}
export type sample = {
  name: string;
  quantity: number;
};
export interface FCRRecord {
  farmer: string;
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
  farmStock: sample[];
  totalFeed: sample[];
  date: string;
}
