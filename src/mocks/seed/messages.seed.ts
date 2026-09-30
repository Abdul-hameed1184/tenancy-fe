import type { Message, MessageThread } from "@/types/entities";

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const messageThreads: MessageThread[] = [
  {
    id: "thread-1",
    participantIds: ["tenant-1", "agent-1"],
    propertyId: "prop-1",
    lastMessageAt: daysFromNow(-1),
  },
  {
    id: "thread-2",
    participantIds: ["landlord-1", "agent-1"],
    propertyId: "prop-1",
    lastMessageAt: daysFromNow(-4),
  },
  {
    id: "thread-3",
    participantIds: ["tenant-4", "agent-2"],
    propertyId: "prop-2",
    lastMessageAt: daysFromNow(-2),
  },
  {
    id: "thread-4",
    participantIds: ["tenant-8", "agent-3"],
    propertyId: "prop-10",
    lastMessageAt: daysFromNow(-1),
  },
];

export const messages: Message[] = [
  {
    id: "msg-1",
    threadId: "thread-1",
    senderId: "tenant-1",
    body: "Hi Tunde, the kitchen tap is leaking again — could someone take a look this week?",
    sentAt: daysFromNow(-1.2),
    readAt: daysFromNow(-1.1),
  },
  {
    id: "msg-2",
    threadId: "thread-1",
    senderId: "agent-1",
    body: "Morning! I've logged it as a high-priority ticket, plumber is scheduled for today.",
    sentAt: daysFromNow(-1),
  },
  {
    id: "msg-3",
    threadId: "thread-2",
    senderId: "landlord-1",
    body: "Can you confirm the annual rent for Eko Sky Terrace was received?",
    sentAt: daysFromNow(-4.1),
  },
  {
    id: "msg-4",
    threadId: "thread-2",
    senderId: "agent-1",
    body: "Confirmed, payment logged and verified on the platform.",
    sentAt: daysFromNow(-4),
  },
  {
    id: "msg-5",
    threadId: "thread-3",
    senderId: "tenant-4",
    body: "Hi Sarah, the AC on the ground floor is only blowing warm air — can we get someone out this week?",
    sentAt: daysFromNow(-2.2),
  },
  {
    id: "msg-6",
    threadId: "thread-3",
    senderId: "agent-2",
    body: "Thanks for flagging — I've logged it and an HVAC technician will be in touch to schedule a visit.",
    sentAt: daysFromNow(-2),
  },
  {
    id: "msg-7",
    threadId: "thread-4",
    senderId: "tenant-8",
    body: "Reminder that the generator isn't auto-switching during outages — any update on the electrician?",
    sentAt: daysFromNow(-1.2),
  },
  {
    id: "msg-8",
    threadId: "thread-4",
    senderId: "agent-3",
    body: "Electrician is booked for tomorrow morning, will confirm once the fix is done.",
    sentAt: daysFromNow(-1),
  },
];
