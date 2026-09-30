import { withLatency } from "@/lib/api/http";
import { db, genId } from "@/mocks/db";
import type { Inspection, InspectionStatus } from "@/types/entities";

export interface InspectionFilters {
  agentId?: string;
  tenantId?: string;
  propertyId?: string;
  status?: InspectionStatus;
}

export function getInspections(filters: InspectionFilters = {}): Promise<Inspection[]> {
  return withLatency(() => {
    let results = [...db.inspections];
    if (filters.agentId) results = results.filter((i) => i.agentId === filters.agentId);
    if (filters.tenantId) results = results.filter((i) => i.tenantId === filters.tenantId);
    if (filters.propertyId) results = results.filter((i) => i.propertyId === filters.propertyId);
    if (filters.status) results = results.filter((i) => i.status === filters.status);
    return results.sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
  });
}

export function getInspection(id: string): Promise<Inspection> {
  return withLatency(() => {
    const inspection = db.inspections.find((i) => i.id === id);
    if (!inspection) throw new Error(`Inspection ${id} not found`);
    return inspection;
  });
}

export function requestInspection(
  dto: Pick<Inspection, "propertyId" | "tenantId" | "agentId" | "prospectName" | "scheduledAt">,
): Promise<Inspection> {
  return withLatency(() => {
    const inspection: Inspection = {
      ...dto,
      id: genId("insp"),
      requestedAt: new Date().toISOString(),
      status: "requested",
    };
    db.inspections.push(inspection);
    return inspection;
  });
}

function setStatus(id: string, status: InspectionStatus): Inspection {
  const idx = db.inspections.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error(`Inspection ${id} not found`);
  db.inspections[idx] = { ...db.inspections[idx], status };
  return db.inspections[idx];
}

export function confirmInspection(id: string): Promise<Inspection> {
  return withLatency(() => setStatus(id, "confirmed"));
}

export function completeInspection(id: string): Promise<Inspection> {
  return withLatency(() => setStatus(id, "completed"));
}

export function cancelInspection(id: string): Promise<Inspection> {
  return withLatency(() => setStatus(id, "cancelled"));
}
