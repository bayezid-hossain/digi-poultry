export interface OrganizationType {
  id: string;
  name: string;
}
export interface OrganizationsType {
  organizations?: OrganizationType[];
  currentOrg?: string;
}
