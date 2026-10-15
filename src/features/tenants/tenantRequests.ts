import { http } from "@/lib/api/http";
import { USE_MOCKS } from "@/lib/api/config";
import * as mock from "./tenantRequests.mock";

export interface TenantCandidate {
  id: string;
  name: string;
}

export interface TenantChangeRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  tenantName: string;
  action: "assign" | "remove";
  status: "pending" | "approved" | "rejected";
  unit: string;
  leaseStart: string | null;
  nextDueDate: string | null;
  createdAt: string;
}

const remote = {
  searchTenantCandidates: (propertyId: string, search: string) =>
    http.get<TenantCandidate[]>(`/properties/${propertyId}/tenant-candidates`, {
      search,
    }),

  getTenantChangeRequests: (propertyId: string) =>
    http.get<TenantChangeRequest[]>(
      `/properties/${propertyId}/tenant-requests`,
    ),

  requestTenantAssignment: (
    propertyId: string,
    tenantId: string,
    unit: string,
    leaseStart: string,
    nextDueDate: string,
  ) =>
    http.post<TenantChangeRequest>(
      `/properties/${propertyId}/tenant-requests`,
      {
        action: "assign",
        tenantId,
        unit,
        leaseStart,
        nextDueDate,
      },
    ),

  requestTenantRemoval: (propertyId: string, tenantId: string) =>
    http.post<TenantChangeRequest>(
      `/properties/${propertyId}/tenant-requests`,
      {
        action: "remove",
        tenantId,
      },
    ),

  decideTenantChangeRequest: (
    requestId: string,
    decision: "approve" | "reject",
  ) =>
    http.post<TenantChangeRequest>(`/tenant-requests/${requestId}/decision`, {
      decision,
    }),
};

const api: typeof remote = USE_MOCKS ? mock : remote;

export const {
  searchTenantCandidates,
  getTenantChangeRequests,
  requestTenantAssignment,
  requestTenantRemoval,
  decideTenantChangeRequest,
} = api;
