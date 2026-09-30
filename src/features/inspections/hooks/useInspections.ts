import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getInspections, type InspectionFilters } from "../api";

export function useInspections(filters: InspectionFilters = {}) {
  return useQuery({
    queryKey: queryKeys.inspections.list(filters),
    queryFn: () => getInspections(filters),
  });
}
