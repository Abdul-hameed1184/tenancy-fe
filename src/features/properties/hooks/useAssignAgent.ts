import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { assignAgentToProperty } from "../api";

export function useAssignAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, agentId }: { propertyId: string; agentId: string }) =>
      assignAgentToProperty(propertyId, agentId),
    onSuccess: (_assignment, { propertyId, agentId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.detail(propertyId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.detail(agentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      toast.success("Agent assigned to property.");
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't assign agent."),
  });
}
