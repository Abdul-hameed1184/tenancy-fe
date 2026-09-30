import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import type { MaintenanceStatus } from "@/types/entities";
import { updateMaintenanceStatus } from "../api";

export function useUpdateMaintenanceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MaintenanceStatus }) =>
      updateMaintenanceStatus(id, status),
    onSuccess: (_request, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.detail(id) });
      toast.success("Maintenance status updated.");
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't update status."),
  });
}
