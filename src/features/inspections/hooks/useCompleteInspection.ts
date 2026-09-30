import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { completeInspection } from "../api";

export function useCompleteInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeInspection(id),
    onSuccess: (_inspection, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inspections.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.inspections.detail(id) });
      toast.success("Inspection marked complete.");
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't complete inspection."),
  });
}
