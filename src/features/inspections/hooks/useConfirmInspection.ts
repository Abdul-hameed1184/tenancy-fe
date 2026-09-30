import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { confirmInspection } from "../api";

export function useConfirmInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => confirmInspection(id),
    onSuccess: (_inspection, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inspections.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.inspections.detail(id) });
      toast.success("Inspection confirmed.");
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't confirm inspection."),
  });
}
