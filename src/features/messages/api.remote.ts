import { http } from "@/lib/api/http";
import type { Message, MessageContact, MessageThread } from "@/types/entities";

export const getThreads = async (userId: string) => {
  await http.post<void>("/threads/initialize", {});
  return http.get<MessageThread[]>("/threads", { userId });
};

export const getMessageContacts = (userId: string) =>
  http.get<MessageContact[]>("/message-contacts", { userId });

export const getThreadMessages = (threadId: string) =>
  http.get<Message[]>(`/threads/${threadId}/messages`);

export const markThreadRead = (threadId: string, _userId?: string) =>
  http.post<void>(`/threads/${threadId}/read`, {});

export const sendMessage = (threadId: string, senderId: string, body: string) =>
  http.post<Message>(`/threads/${threadId}/messages`, { senderId, body });
