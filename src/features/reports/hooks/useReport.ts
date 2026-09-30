import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getReport } from "../api";

export function useReport(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.reports.detail(id ?? ""),
    queryFn: () => getReport(id as string),
    enabled: Boolean(id),
  });
}
