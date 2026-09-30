import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getTenancies, type TenancyFilters } from "../api";

export function useTenancies(filters: TenancyFilters = {}) {
  return useQuery({
    queryKey: [...queryKeys.tenants.list(), filters],
    queryFn: () => getTenancies(filters),
  });
}
