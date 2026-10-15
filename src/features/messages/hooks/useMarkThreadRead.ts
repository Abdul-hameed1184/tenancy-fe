import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { markThreadRead } from "../api";

export function useMarkThreadRead(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId: string) => markThreadRead(threadId, userId),
    onSuccess: () => {
      if (userId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.messages.threads(userId),
        });
      }
    },
  });
}
