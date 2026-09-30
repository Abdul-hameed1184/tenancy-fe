import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { createProperty } from "../api";

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      toast.success("Property listed.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Couldn't list this property — try again.");
    },
  });
}
