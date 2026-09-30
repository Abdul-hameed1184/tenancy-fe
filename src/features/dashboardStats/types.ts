export interface AgentStats {
  activeProperties: number;
  activePropertiesNewThisMonth: number;
  totalTenants: number;
  totalTenantsHighPriority: number;
  maintenancePending: number;
  maintenanceHighPriority: number;
  upcomingInspections: number;
  inspectionsScheduledToday: number;
}

export interface LandlordStats {
  totalPortfolioValue: number;
  portfolioValueChangePct: number;
  annualRevenue: number;
  collectionRatePct: number;
  occupancyRatePct: number;
  vacantUnits: number;
  managedAssets: number;
  citiesCount: number;
}
