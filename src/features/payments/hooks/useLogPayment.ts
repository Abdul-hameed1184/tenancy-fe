import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import type { PaymentEntry } from "@/types/entities";
import { logPayment, type LogPaymentInput } from "../api";

export function useLogPayment(tenancyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LogPaymentInput) => logPayment(tenancyId, input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.payments.history(tenancyId) });
      const previous = queryClient.getQueryData<PaymentEntry[]>(
        queryKeys.payments.history(tenancyId),
      );

      const optimisticEntry: PaymentEntry = {
        id: `optimistic-${Date.now()}`,
        tenancyId,
        loggedAt: new Date().toISOString(),
        ...input,
      };
      queryClient.setQueryData<PaymentEntry[]>(queryKeys.payments.history(tenancyId), (old) => [
        ...(old ?? []),
        optimisticEntry,
      ]);

      return { previous };
    },
    onError: (error: Error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.payments.history(tenancyId), context.previous);
      }
      toast.error(error.message || "Couldn't log payment.");
    },
    onSuccess: () => {
      toast.success("Payment logged to the tenancy history.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.history(tenancyId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.detail(tenancyId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
    },
  });
}
