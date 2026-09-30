import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getAgent } from "../api";

export function useAgent(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.agents.detail(id ?? ""),
    queryFn: () => getAgent(id as string),
    enabled: Boolean(id),
  });
}
