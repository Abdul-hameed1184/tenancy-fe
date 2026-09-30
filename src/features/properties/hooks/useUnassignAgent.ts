import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { unassignAgent } from "../api";

export function useUnassignAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => unassignAgent(propertyId),
    onSuccess: (_result, propertyId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.detail(propertyId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      toast.success("Agent unassigned from property.");
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't unassign agent."),
  });
}
