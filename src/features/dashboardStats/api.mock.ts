import { withLatency } from "@/lib/api/http";
import { db } from "@/mocks/db";
import type { AgentStats, LandlordStats } from "./types";

export function getAgentStats(agentId: string): Promise<AgentStats> {
  return withLatency(() => {
    const propertyIds = new Set(
      db.agentAssignments
        .filter((a) => a.agentId === agentId && a.active)
        .map((a) => a.propertyId),
    );

    const tenancies = db.tenancies.filter((t) => propertyIds.has(t.propertyId));
    const maintenance = db.maintenanceRequests.filter(
      (m) => propertyIds.has(m.propertyId) && m.status !== "completed",
    );
    const inspections = db.inspections.filter(
      (i) =>
        i.agentId === agentId &&
        (i.status === "requested" || i.status === "confirmed"),
    );

    const today = new Date().toDateString();
    const scheduledToday = inspections.filter(
      (i) => new Date(i.scheduledAt).toDateString() === today,
    ).length;

    return {
      activeProperties: propertyIds.size,
      activePropertiesNewThisMonth: 0,
      totalTenants: tenancies.length,
      totalTenantsHighPriority: 0,
      maintenancePending: maintenance.length,
      maintenanceHighPriority: maintenance.filter((m) => m.priority === "high")
        .length,
      upcomingInspections: inspections.length,
      inspectionsScheduledToday: scheduledToday,
    };
  });
}

export function getLandlordStats(landlordId: string): Promise<LandlordStats> {
  return withLatency(() => {
    const properties = db.properties.filter((p) => p.landlordId === landlordId);
    const occupiedProperties = properties.filter(
      (property) => property.status === "occupied",
    );
    const totalAnnualRent = properties.reduce(
      (sum, property) => sum + property.priceAnnual,
      0,
    );
    const annualRevenue = occupiedProperties.reduce(
      (sum, property) => sum + property.priceAnnual,
      0,
    );
    const cities = new Set(properties.map((property) => property.city));
    const vacantUnits = properties.length - occupiedProperties.length;
    const occupancyRatePct = properties.length
      ? Math.round((occupiedProperties.length / properties.length) * 100)
      : 0;
    const collectionRatePct = properties.length
      ? Math.round(
          (occupiedProperties.length / Math.max(properties.length, 1)) * 100,
        )
      : 0;

    return {
      totalPortfolioValue: totalAnnualRent,
      portfolioValueChangePct: occupancyRatePct,
      annualRevenue,
      collectionRatePct,
      occupancyRatePct,
      vacantUnits,
      managedAssets: properties.length,
      citiesCount: cities.size,
    };
  });
}
