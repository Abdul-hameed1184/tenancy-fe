import { withLatency } from "@/lib/api/http";
import { db } from "@/mocks/db";
import { managingAgentIdOf } from "@/features/properties/api.mock";
import type { TenancyDetail } from "./types";

function toDetail(tenancyId: string): TenancyDetail | undefined {
  const tenancy = db.tenancies.find((t) => t.id === tenancyId);
  if (!tenancy) return undefined;
  const tenant = db.users.find((u) => u.id === tenancy.tenantId);
  const property = db.properties.find((p) => p.id === tenancy.propertyId);
  if (!tenant || !property) return undefined;
  return { ...tenancy, tenant, property: { ...property, agentId: managingAgentIdOf(property.id) } };
}

export interface TenancyFilters {
  agentId?: string;
  landlordId?: string;
  propertyId?: string;
}

export function getTenancies(filters: TenancyFilters = {}): Promise<TenancyDetail[]> {
  return withLatency(() => {
    let details = db.tenancies
      .map((t) => toDetail(t.id))
      .filter((d): d is TenancyDetail => Boolean(d));

    if (filters.propertyId) {
      details = details.filter((d) => d.propertyId === filters.propertyId);
    }
    if (filters.agentId) {
      details = details.filter((d) => managingAgentIdOf(d.propertyId) === filters.agentId);
    }
    if (filters.landlordId) {
      details = details.filter((d) => d.property.landlordId === filters.landlordId);
    }
    return details;
  });
}

export function getTenancy(id: string): Promise<TenancyDetail> {
  return withLatency(() => {
    const detail = toDetail(id);
    if (!detail) throw new Error(`Tenancy ${id} not found`);
    return detail;
  });
}

export function getTenancyByTenantId(tenantId: string): Promise<TenancyDetail> {
  return withLatency(() => {
    const tenancy = db.tenancies.find((t) => t.tenantId === tenantId);
    if (!tenancy) throw new Error(`No tenancy found for tenant ${tenantId}`);
    const detail = toDetail(tenancy.id);
    if (!detail) throw new Error(`Tenancy ${tenancy.id} not found`);
    return detail;
  });
}
