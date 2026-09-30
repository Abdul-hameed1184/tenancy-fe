import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getReports, type ReportFilters } from "../api";

export function useReports(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: queryKeys.reports.list(filters),
    queryFn: () => getReports(filters),
  });
}
