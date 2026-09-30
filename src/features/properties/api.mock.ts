import { withLatency } from "@/lib/api/http";
import { db, genId } from "@/mocks/db";
import type { Property, PropertyAgentAssignment, PropertyStatus } from "@/types/entities";

export interface PropertyFilters {
  city?: string;
  agentId?: string;
  landlordId?: string;
  status?: PropertyStatus;
  search?: string;
}

function propertyIdsForAgent(agentId: string) {
  return new Set(
    db.agentAssignments.filter((a) => a.agentId === agentId && a.active).map((a) => a.propertyId),
  );
}

/** Mock-only helper: active managing agent for a property. */
export function managingAgentIdOf(propertyId: string): string | null {
  return db.agentAssignments.find((a) => a.propertyId === propertyId && a.active)?.agentId ?? null;
}

function withAgent(property: Property): Property {
  return { ...property, agentId: managingAgentIdOf(property.id) };
}

export function getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  return withLatency(() => {
    let results = [...db.properties];

    if (filters.landlordId) {
      results = results.filter((p) => p.landlordId === filters.landlordId);
    }
    if (filters.agentId) {
      const ids = propertyIdsForAgent(filters.agentId);
      results = results.filter((p) => ids.has(p.id));
    }
    if (filters.city) {
      results = results.filter((p) => p.city === filters.city);
    }
    if (filters.status) {
      results = results.filter((p) => p.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q),
      );
    }
    return results.map(withAgent);
  });
}

export function getProperty(id: string): Promise<Property> {
  return withLatency(() => {
    const property = db.properties.find((p) => p.id === id);
    if (!property) throw new Error(`Property ${id} not found`);
    return withAgent(property);
  });
}

export function getFeaturedProperties(): Promise<Property[]> {
  return withLatency(() => db.properties.filter((p) => p.featured).map(withAgent));
}

export function getTopPerformingProperties(agentId: string, limit = 3): Promise<Property[]> {
  return withLatency(() => {
    const ids = propertyIdsForAgent(agentId);
    return db.properties
      .filter((p) => ids.has(p.id))
      .sort((a, b) => b.occupancyRate * b.priceAnnual - a.occupancyRate * a.priceAnnual)
      .slice(0, limit)
      .map(withAgent);
  });
}

export function assignAgentToProperty(
  propertyId: string,
  agentId: string,
): Promise<PropertyAgentAssignment> {
  return withLatency(() => {
    db.agentAssignments = db.agentAssignments.map((a) =>
      a.propertyId === propertyId ? { ...a, active: false } : a,
    );
    const assignment: PropertyAgentAssignment = {
      id: genId("assign"),
      propertyId,
      agentId,
      assignedAt: new Date().toISOString(),
      active: true,
    };
    db.agentAssignments.push(assignment);
    return assignment;
  });
}

export function unassignAgent(propertyId: string): Promise<void> {
  return withLatency(() => {
    db.agentAssignments = db.agentAssignments.map((a) =>
      a.propertyId === propertyId ? { ...a, active: false } : a,
    );
  });
}

export function updateProperty(id: string, patch: Partial<Property>): Promise<Property> {
  return withLatency(() => {
    const idx = db.properties.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Property ${id} not found`);
    db.properties[idx] = { ...db.properties[idx], ...patch };
    return withAgent(db.properties[idx]);
  });
}

export function createProperty(
  dto: Omit<Property, "id" | "occupancyRate" | "status" | "agentId"> & { status?: PropertyStatus },
): Promise<Property> {
  return withLatency(() => {
    const property: Property = {
      ...dto,
      id: genId("prop"),
      status: dto.status ?? "listed",
      occupancyRate: 0,
    };
    db.properties.push(property);
    return withAgent(property);
  });
}
