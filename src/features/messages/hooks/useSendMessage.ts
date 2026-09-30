import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import type { Message } from "@/types/entities";
import { sendMessage } from "../api";

export function useSendMessage(threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ senderId, body }: { senderId: string; body: string }) =>
      sendMessage(threadId, senderId, body),
    onMutate: async ({ senderId, body }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.messages.thread(threadId) });
      const previous = queryClient.getQueryData<Message[]>(queryKeys.messages.thread(threadId));

      const optimisticMessage: Message = {
        id: `optimistic-${Date.now()}`,
        threadId,
        senderId,
        body,
        sentAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Message[]>(queryKeys.messages.thread(threadId), (old) => [
        ...(old ?? []),
        optimisticMessage,
      ]);

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.messages.thread(threadId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.thread(threadId) });
    },
  });
}
