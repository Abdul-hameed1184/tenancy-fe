import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import type { VerificationStatus } from "@/types/entities";
import { reviewAgentVerification } from "../api";

export function useReviewAgentVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      decision,
    }: {
      agentId: string;
      decision: Extract<VerificationStatus, "verified" | "rejected">;
    }) => reviewAgentVerification(agentId, decision),
    onSuccess: (agent) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.verificationQueue() });
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.detail(agent.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.all });
      toast.success(
        agent.verificationStatus === "verified"
          ? `${agent.name} is now a verified agent.`
          : `${agent.name}'s verification was rejected.`,
      );
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't review verification."),
  });
}
