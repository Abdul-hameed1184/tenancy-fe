import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getPaymentHistory } from "../api";

export function usePaymentHistory(tenancyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.payments.history(tenancyId ?? ""),
    queryFn: () => getPaymentHistory(tenancyId as string),
    enabled: Boolean(tenancyId),
  });
}
