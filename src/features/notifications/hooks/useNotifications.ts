import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getNotifications } from "../api";

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: getNotifications,
    refetchInterval: 30_000,
  });
}
