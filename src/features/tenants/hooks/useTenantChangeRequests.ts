import { useQuery } from "@tanstack/react-query";
import { getTenantChangeRequests } from "../tenantRequests";

export function useTenantChangeRequests(propertyId: string | undefined) {
  return useQuery({
    queryKey: ["tenants", "requests", propertyId],
    queryFn: () => getTenantChangeRequests(propertyId as string),
    enabled: Boolean(propertyId),
  });
}
