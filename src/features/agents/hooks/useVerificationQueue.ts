import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getVerificationQueue } from "../api";

export function useVerificationQueue() {
  return useQuery({
    queryKey: queryKeys.agents.verificationQueue(),
    queryFn: getVerificationQueue,
  });
}
