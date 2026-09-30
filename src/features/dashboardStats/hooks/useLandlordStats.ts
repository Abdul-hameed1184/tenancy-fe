import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getLandlordStats } from "../api";

export function useLandlordStats(landlordId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.dashboardStats.landlord(landlordId ?? ""),
    queryFn: () => getLandlordStats(landlordId as string),
    enabled: Boolean(landlordId),
  });
}
