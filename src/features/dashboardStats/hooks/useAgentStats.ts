import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getAgentStats } from "../api";

export function useAgentStats(agentId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.dashboardStats.agent(agentId ?? ""),
    queryFn: () => getAgentStats(agentId as string),
    enabled: Boolean(agentId),
  });
}
