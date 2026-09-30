import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getAgents, type AgentFilters } from "../api";

export function useAgents(filters: AgentFilters = {}) {
  return useQuery({
    queryKey: queryKeys.agents.list(filters),
    queryFn: () => getAgents(filters),
  });
}
