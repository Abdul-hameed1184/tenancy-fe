import { http } from "@/lib/api/http";
import type { Inspection } from "@/types/entities";
import type { InspectionFilters } from "./api.mock";

export const getInspections = (filters: InspectionFilters = {}) =>
  http.get<Inspection[]>("/inspections", filters);

export const getInspection = (id: string) => http.get<Inspection>(`/inspections/${id}`);

export const requestInspection = (
  dto: Pick<Inspection, "propertyId" | "tenantId" | "agentId" | "prospectName" | "scheduledAt">,
) => http.post<Inspection>("/inspections", dto);

export const confirmInspection = (id: string) => http.post<Inspection>(`/inspections/${id}/confirm`);

export const completeInspection = (id: string) =>
  http.post<Inspection>(`/inspections/${id}/complete`);

export const cancelInspection = (id: string) => http.post<Inspection>(`/inspections/${id}/cancel`);
