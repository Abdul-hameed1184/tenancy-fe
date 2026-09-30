import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getProperties, type PropertyFilters } from "../api";

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: queryKeys.properties.list(filters),
    queryFn: () => getProperties(filters),
  });
}
