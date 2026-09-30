import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReport } from "../api";

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report filed — the PLEET team will review it.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Couldn't file this report — try again.");
    },
  });
}
