import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { cancelInspection } from "../api";

export function useCancelInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelInspection(id),
    onSuccess: (_inspection, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inspections.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.inspections.detail(id) });
      toast.success("Inspection cancelled.");
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't cancel inspection."),
  });
}
