import { withLatency } from "@/lib/api/http";
import { db } from "@/mocks/db";
import type { AgentStats, LandlordStats } from "./types";

const PORTFOLIO_VALUE_MULTIPLIER = 6;

export function getAgentStats(agentId: string): Promise<AgentStats> {
  return withLatency(() => {
    const propertyIds = new Set(
      db.agentAssignments.filter((a) => a.agentId === agentId && a.active).map((a) => a.propertyId),
    );

    const tenancies = db.tenancies.filter((t) => propertyIds.has(t.propertyId));
    const maintenance = db.maintenanceRequests.filter(
      (m) => propertyIds.has(m.propertyId) && m.status !== "completed",
    );
    const inspections = db.inspections.filter(
      (i) => i.agentId === agentId && (i.status === "requested" || i.status === "confirmed"),
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
      maintenanceHighPriority: maintenance.filter((m) => m.priority === "high").length,
      upcomingInspections: inspections.length,
      inspectionsScheduledToday: scheduledToday,
    };
  });
}

export function getLandlordStats(landlordId: string): Promise<LandlordStats> {
  return withLatency(() => {
    const properties = db.properties.filter((p) => p.landlordId === landlordId);
    const totalAnnualRent = properties.reduce((sum, p) => sum + p.priceAnnual, 0);
    const occupiedRent = properties
      .filter((p) => p.status === "occupied")
      .reduce((sum, p) => sum + p.priceAnnual, 0);
    const avgOccupancy =
      properties.reduce((sum, p) => sum + p.occupancyRate, 0) / (properties.length || 1);
    const cities = new Set(properties.map((p) => p.city));

    return {
      totalPortfolioValue: totalAnnualRent * PORTFOLIO_VALUE_MULTIPLIER,
      portfolioValueChangePct: 12,
      annualRevenue: occupiedRent,
      collectionRatePct: 98,
      occupancyRatePct: Math.round(avgOccupancy),
      vacantUnits: properties.filter((p) => p.status !== "occupied").length,
      managedAssets: properties.length,
      citiesCount: cities.size,
    };
  });
}
