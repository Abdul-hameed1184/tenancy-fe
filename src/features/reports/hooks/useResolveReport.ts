import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveReport } from "../api";

export function useResolveReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resolveReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report resolved.");
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't resolve report."),
  });
}
