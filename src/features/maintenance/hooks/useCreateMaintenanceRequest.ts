import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { createMaintenanceRequest } from "../api";

export function useCreateMaintenanceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMaintenanceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.all });
      toast.success("Maintenance request submitted.");
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't submit request."),
  });
}
