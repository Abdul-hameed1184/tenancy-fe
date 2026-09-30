import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getMaintenanceRequests, type MaintenanceFilters } from "../api";

export function useMaintenanceRequests(filters: MaintenanceFilters = {}) {
  return useQuery({
    queryKey: queryKeys.maintenance.list(filters),
    queryFn: () => getMaintenanceRequests(filters),
  });
}
