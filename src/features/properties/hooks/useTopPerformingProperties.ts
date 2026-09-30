import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getTopPerformingProperties } from "../api";

export function useTopPerformingProperties(agentId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.properties.topPerforming(agentId ?? ""),
    queryFn: () => getTopPerformingProperties(agentId as string),
    enabled: Boolean(agentId),
  });
}
