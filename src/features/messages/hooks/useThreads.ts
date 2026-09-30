import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getThreads } from "../api";

export function useThreads(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.messages.threads(userId ?? ""),
    queryFn: () => getThreads(userId as string),
    enabled: Boolean(userId),
  });
}
