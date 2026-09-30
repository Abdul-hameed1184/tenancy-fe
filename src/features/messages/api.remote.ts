import { http } from "@/lib/api/http";
import type { Message, MessageThread } from "@/types/entities";

export const getThreads = (userId: string) => http.get<MessageThread[]>("/threads", { userId });

export const getThreadMessages = (threadId: string) =>
  http.get<Message[]>(`/threads/${threadId}/messages`);

export const sendMessage = (threadId: string, senderId: string, body: string) =>
  http.post<Message>(`/threads/${threadId}/messages`, { senderId, body });
