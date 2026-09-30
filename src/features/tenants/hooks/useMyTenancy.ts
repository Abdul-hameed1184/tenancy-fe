import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getTenancyByTenantId } from "../api";

export function useMyTenancy(tenantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tenants.myTenancy(tenantId ?? ""),
    queryFn: () => getTenancyByTenantId(tenantId as string),
    enabled: Boolean(tenantId),
  });
}
