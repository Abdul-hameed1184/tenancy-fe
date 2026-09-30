import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getThreadMessages } from "../api";

export function useThreadMessages(threadId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.messages.thread(threadId ?? ""),
    queryFn: () => getThreadMessages(threadId as string),
    enabled: Boolean(threadId),
  });
}
