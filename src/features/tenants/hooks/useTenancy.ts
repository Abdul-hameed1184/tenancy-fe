import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getTenancy } from "../api";

export function useTenancy(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tenants.detail(id ?? ""),
    queryFn: () => getTenancy(id as string),
    enabled: Boolean(id),
  });
}
