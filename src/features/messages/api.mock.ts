import { withLatency } from "@/lib/api/http";
import { db, genId } from "@/mocks/db";
import type {
  Message,
  MessageContact,
  MessageThread,
  User,
} from "@/types/entities";

function contactsFor(userId: string): MessageContact[] {
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!user) return [];
  const contacts: MessageContact[] = [];
  const addContact = (recipient: User | undefined, propertyId: string) => {
    const property = db.properties.find(
      (candidate) => candidate.id === propertyId,
    );
    if (!recipient || !property || recipient.id === userId) return;
    if (
      contacts.some(
        (contact) =>
          contact.id === recipient.id && contact.propertyId === propertyId,
      )
    )
      return;
    contacts.push({
      id: recipient.id,
      name: recipient.name,
      role: recipient.role,
      propertyId,
      propertyTitle: property.title,
    });
  };

  if (user.role === "tenant") {
    for (const tenancy of db.tenancies.filter(
      (record) => record.tenantId === userId,
    )) {
      const property = db.properties.find(
        (candidate) => candidate.id === tenancy.propertyId,
      );
      const agentId = db.agentAssignments.find(
        (assignment) =>
          assignment.propertyId === tenancy.propertyId && assignment.active,
      )?.agentId;
      addContact(
        db.users.find(
          (candidate) => candidate.id === (agentId ?? property?.landlordId),
        ),
        tenancy.propertyId,
      );
    }
  } else if (user.role === "agent") {
    for (const assignment of db.agentAssignments.filter(
      (candidate) => candidate.agentId === userId && candidate.active,
    )) {
      const property = db.properties.find(
        (candidate) => candidate.id === assignment.propertyId,
      );
      addContact(
        db.users.find((candidate) => candidate.id === property?.landlordId),
        assignment.propertyId,
      );
      for (const tenancy of db.tenancies.filter(
        (record) => record.propertyId === assignment.propertyId,
      )) {
        addContact(
          db.users.find((candidate) => candidate.id === tenancy.tenantId),
          assignment.propertyId,
        );
      }
    }
  } else if (user.role === "landlord") {
    for (const property of db.properties.filter(
      (candidate) => candidate.landlordId === userId,
    )) {
      const agentId = db.agentAssignments.find(
        (assignment) =>
          assignment.propertyId === property.id && assignment.active,
      )?.agentId;
      addContact(
        db.users.find((candidate) => candidate.id === agentId),
        property.id,
      );
      for (const tenancy of db.tenancies.filter(
        (record) => record.propertyId === property.id,
      )) {
        addContact(
          db.users.find((candidate) => candidate.id === tenancy.tenantId),
          property.id,
        );
      }
    }
  }
  return contacts;
}

function initializeThreads(userId: string) {
  for (const contact of contactsFor(userId)) {
    const existing = db.messageThreads.some(
      (thread) =>
        thread.propertyId === contact.propertyId &&
        thread.participantIds.includes(userId) &&
        thread.participantIds.includes(contact.id),
    );
    if (!existing) {
      db.messageThreads.push({
        id: genId("thread"),
        participantIds: [userId, contact.id],
        propertyId: contact.propertyId,
        lastMessageAt: new Date().toISOString(),
      });
    }
  }
}

export function getThreads(userId: string): Promise<MessageThread[]> {
  return withLatency(() => {
    initializeThreads(userId);
    return db.messageThreads
      .filter((t) => t.participantIds.includes(userId))
      .map((thread) => ({
        ...thread,
        lastMessagePreview: db.messages
          .filter((message) => message.threadId === thread.id)
          .sort(
            (a, b) =>
              new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
          )[0]?.body,
        unreadCount: db.messages.filter(
          (message) =>
            message.threadId === thread.id &&
            message.senderId !== userId &&
            !message.readAt,
        ).length,
      }))
      .sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime(),
      );
  });
}

export function markThreadRead(
  threadId: string,
  userId?: string,
): Promise<void> {
  return withLatency(() => {
    if (!userId) return;
    const readAt = new Date().toISOString();
    db.messages = db.messages.map((message) =>
      message.threadId === threadId && message.senderId !== userId
        ? { ...message, readAt }
        : message,
    );
  });
}

export function getMessageContacts(userId: string): Promise<MessageContact[]> {
  return withLatency(() => contactsFor(userId));
}

export function getThreadMessages(threadId: string): Promise<Message[]> {
  return withLatency(() =>
    db.messages
      .filter((m) => m.threadId === threadId)
      .sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
      ),
  );
}

export function sendMessage(
  threadId: string,
  senderId: string,
  body: string,
): Promise<Message> {
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
