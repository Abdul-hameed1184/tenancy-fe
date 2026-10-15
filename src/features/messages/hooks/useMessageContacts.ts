import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getMessageContacts } from "../api";

export function useMessageContacts(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.messages.contacts(userId ?? ""),
    queryFn: () => getMessageContacts(userId as string),
    enabled: Boolean(userId),
  });
}
