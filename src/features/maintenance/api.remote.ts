import { http } from "@/lib/api/http";
import type { MaintenanceRequest, MaintenanceStatus } from "@/types/entities";
import type { MaintenanceFilters } from "./api.mock";

export const getMaintenanceRequests = (filters: MaintenanceFilters = {}) =>
  http.get<MaintenanceRequest[]>("/maintenance-requests", filters);

export const getMaintenanceRequest = (id: string) =>
  http.get<MaintenanceRequest>(`/maintenance-requests/${id}`);

export const createMaintenanceRequest = (
  dto: Pick<MaintenanceRequest, "propertyId" | "tenantId" | "issueType" | "description" | "priority">,
) => http.post<MaintenanceRequest>("/maintenance-requests", dto);

export const updateMaintenanceStatus = (id: string, status: MaintenanceStatus) =>
  http.patch<MaintenanceRequest>(`/maintenance-requests/${id}`, { status });
