import { withLatency } from "@/lib/api/http";
import { db, genId } from "@/mocks/db";
import type { Message, MessageThread } from "@/types/entities";

export function getThreads(userId: string): Promise<MessageThread[]> {
  return withLatency(() =>
    db.messageThreads
      .filter((t) => t.participantIds.includes(userId))
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()),
  );
}

export function getThreadMessages(threadId: string): Promise<Message[]> {
  return withLatency(() =>
    db.messages
      .filter((m) => m.threadId === threadId)
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()),
  );
}

export function sendMessage(threadId: string, senderId: string, body: string): Promise<Message> {
  return withLatency(() => {
    const message: Message = {
      id: genId("msg"),
      threadId,
      senderId,
      body,
      sentAt: new Date().toISOString(),
    };
    db.messages.push(message);
    const thread = db.messageThreads.find((t) => t.id === threadId);
    if (thread) thread.lastMessageAt = message.sentAt;
    return message;
  });
}
