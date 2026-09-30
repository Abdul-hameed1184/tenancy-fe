import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { requestInspection } from "../api";

export function useRequestInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestInspection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inspections.all });
      toast.success("Inspection requested — the agent will confirm shortly.");
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't request inspection."),
  });
}
