import { withLatency } from "@/lib/api/http";
import { db, genId } from "@/mocks/db";
import { managingAgentIdOf } from "@/features/properties/api.mock";
import type { MaintenanceRequest, MaintenanceStatus } from "@/types/entities";

export interface MaintenanceFilters {
  agentId?: string;
  tenantId?: string;
  propertyId?: string;
  status?: MaintenanceStatus;
}

export function getMaintenanceRequests(
  filters: MaintenanceFilters = {},
): Promise<MaintenanceRequest[]> {
  return withLatency(() => {
    let results = [...db.maintenanceRequests];
    if (filters.tenantId) results = results.filter((m) => m.tenantId === filters.tenantId);
    if (filters.propertyId) results = results.filter((m) => m.propertyId === filters.propertyId);
    if (filters.status) results = results.filter((m) => m.status === filters.status);
    if (filters.agentId) {
      results = results.filter((m) => managingAgentIdOf(m.propertyId) === filters.agentId);
    }
    return results.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
  });
}

export function getMaintenanceRequest(id: string): Promise<MaintenanceRequest> {
  return withLatency(() => {
    const request = db.maintenanceRequests.find((m) => m.id === id);
    if (!request) throw new Error(`Maintenance request ${id} not found`);
    return request;
  });
}

export function createMaintenanceRequest(
  dto: Pick<MaintenanceRequest, "propertyId" | "tenantId" | "issueType" | "description" | "priority">,
): Promise<MaintenanceRequest> {
  return withLatency(() => {
    const request: MaintenanceRequest = {
      ...dto,
      id: genId("maint"),
      status: "reported",
      reportedAt: new Date().toISOString(),
    };
    db.maintenanceRequests.push(request);
    return request;
  });
}

export function updateMaintenanceStatus(
  id: string,
  status: MaintenanceStatus,
): Promise<MaintenanceRequest> {
  return withLatency(() => {
    const idx = db.maintenanceRequests.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Maintenance request ${id} not found`);
    db.maintenanceRequests[idx] = { ...db.maintenanceRequests[idx], status };
    return db.maintenanceRequests[idx];
  });
}
