import { http } from "@/lib/api/http";
import type { TenancyFilters } from "./api.mock";
import type { TenancyDetail } from "./types";

export const getTenancies = (filters: TenancyFilters = {}) =>
  http.get<TenancyDetail[]>("/tenancies", filters);

export const getTenancy = (id: string) => http.get<TenancyDetail>(`/tenancies/${id}`);

export const getTenancyByTenantId = (tenantId: string) =>
  http.get<TenancyDetail>(`/tenants/${tenantId}/tenancy`);
