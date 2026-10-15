import { ArrowLeft, Check, CheckCheck, MessageSquareText, Search, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { useSession } from "@/features/auth/hooks/useSession";
import { formatRelativeTime } from "@/lib/utils";
import { useThreads } from "../hooks/useThreads";
import { useMessageContacts } from "../hooks/useMessageContacts";
import { useThreadMessages } from "../hooks/useThreadMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import { useMarkThreadRead } from "../hooks/useMarkThreadRead";

function messageTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function initials(value: string) {
  return value.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase();
}

export function MessagesView() {
  const user = useSession();
  const { data: threads, isLoading, error } = useThreads(user?.id);
  const { data: contacts } = useMessageContacts(user?.id);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);
  const threadId = activeThreadId ?? threads?.[0]?.id;
  const activeThread = threads?.find((thread) => thread.id === threadId);
  const otherId = activeThread?.participantIds.find((participantId) => participantId !== user?.id);
  const activeContact = contacts?.find(
    (contact) => contact.id === otherId && contact.propertyId === activeThread?.propertyId,
  );
  const { data: messages, isLoading: messagesLoading } = useThreadMessages(threadId);
  const sendMessage = useSendMessage(threadId ?? "");
  const markRead = useMarkThreadRead(user?.id);
  const [draft, setDraft] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!threadId || !messages) return;
    markRead.mutate(threadId);
  }, [threadId, messages?.length]);

  useEffect(() => {
    const list = messageListRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [threadId, messages?.length]);

  const filteredThreads = (threads ?? []).filter((thread) => {
    const peerId = thread.participantIds.find((participantId) => participantId !== user?.id);
    const contact = contacts?.find(
      (candidate) => candidate.id === peerId && candidate.propertyId === thread.propertyId,
    );
    const haystack = `${contact?.name ?? "Property contact"} ${contact?.propertyTitle ?? ""}`.toLowerCase();
    return haystack.includes(search.trim().toLowerCase());
  });

  if (isLoading) return <LoadingSkeletonCard lines={4} />;

  if (error) {
    return (
      <EmptyState
        message="Couldn't start your conversations."
        hint={error.message}
      />
    );
  }

  if (!threads?.length) {
    return (
      <EmptyState
        message="No conversations are available yet."
        hint="Your chats will appear here when you have an assigned agent or tenants under your management."
      />
    );
  }

  return (
    <section className="absolute inset-0 min-h-0 w-full overflow-hidden border-y border-navy-700/70 bg-[#101b1b]">
      <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        <aside className={`${showThreadOnMobile ? "hidden" : "flex"} min-h-0 flex-col border-r border-navy-700/70 bg-navy-950/80 lg:flex`}>
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-navy-700/70 px-5">
            <div>
              <h2 className="text-base font-semibold text-white">Chats</h2>
              <p className="text-xs text-navy-400">{threads?.length ?? 0} conversations</p>
            </div>
            <MessageSquareText className="h-5 w-5 text-brand-400" />
          </div>
          <div className="border-b border-navy-700/50 p-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search chats"
                aria-label="Search conversations"
                className="h-10 rounded-md border-transparent bg-navy-900 pl-9 focus-visible:border-brand-500"
              />
            </label>
          </div>
          <nav aria-label="Conversations" className="min-h-0 flex-1 overflow-y-auto">
            {filteredThreads.map((thread) => {
              const peerId = thread.participantIds.find((participantId) => participantId !== user?.id);
              const contact = contacts?.find(
                (candidate) => candidate.id === peerId && candidate.propertyId === thread.propertyId,
              );
              const name = contact?.name ?? "Property contact";
              const preview = thread.lastMessagePreview;
              const isActive = thread.id === threadId;

              return (
                <button
                  type="button"
                  key={thread.id}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    setShowThreadOnMobile(true);
                  }}
                  className={`flex min-h-[76px] w-full items-center gap-3 border-b border-navy-800/80 px-4 text-left transition-colors hover:bg-navy-900/80 ${isActive ? "bg-navy-900" : ""}`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#23584e] text-sm font-semibold text-white">
                    {initials(name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-white">{name}</span>
                      <span className="shrink-0 text-[11px] text-navy-500">{formatRelativeTime(thread.lastMessageAt)}</span>
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-navy-400">
                        {contact?.propertyTitle ?? "Conversation"}{preview ? ` · ${preview}` : " · Start a conversation"}
                      </span>
                      {!!thread.unreadCount && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#25a985] px-1.5 text-[11px] font-bold text-white" aria-label={`${thread.unreadCount} unread messages`}>
                          {thread.unreadCount > 99 ? "99+" : thread.unreadCount}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
            {!filteredThreads.length && <p className="px-5 py-8 text-center text-sm text-navy-500">No matching chats</p>}
          </nav>
        </aside>

        <div className={`${showThreadOnMobile ? "flex" : "hidden"} min-h-0 flex-col bg-[#101b1b] lg:flex`}>
          {activeThread ? (
            <>
              <header className="flex h-[4.5rem] shrink-0 items-center gap-3 border-b border-navy-700/70 bg-navy-950/90 px-3 sm:px-5">
                <button
                  type="button"
                  onClick={() => setShowThreadOnMobile(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy-300 hover:bg-navy-800 lg:hidden"
                  aria-label="Back to chats"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#23584e] text-sm font-semibold text-white">
                  {initials(activeContact?.name ?? "Property contact")}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold text-white sm:text-base">{activeContact?.name ?? "Property contact"}</h2>
                  <p className="truncate text-xs text-navy-400">{activeContact?.propertyTitle ?? "PLEET conversation"} · {activeContact?.role ?? "Contact"}</p>
                </div>
              </header>

              <div ref={messageListRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-6" style={{ backgroundImage: "radial-gradient(rgba(130,160,150,.055) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
                {messagesLoading ? (
                  <div className="grid h-full place-items-center"><LoadingSkeletonCard lines={3} /></div>
                ) : messages?.length ? (
                  <div className="mx-auto flex max-w-3xl flex-col gap-2">
                    {messages.map((message) => {
                      const isMine = message.senderId === user?.id;
                      return (
                        <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[88%] rounded-lg px-3 py-2 shadow-sm sm:max-w-[75%] ${isMine ? "rounded-br-sm bg-[#176b5b] text-white" : "rounded-bl-sm bg-[#253333] text-white"}`}>
                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.body}</p>
                            <p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMine ? "text-emerald-100/70" : "text-navy-400"}`}>
                              {messageTime(message.sentAt)}
                              {isMine && (message.readAt ? <CheckCheck className="h-3.5 w-3.5 text-sky-200" /> : <Check className="h-3.5 w-3.5" />)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid h-full place-items-center">
                    <div className="max-w-xs rounded-lg bg-navy-950/80 px-5 py-4 text-center shadow-sm">
                      <p className="text-sm font-medium text-white">This conversation is ready</p>
                      <p className="mt-1 text-xs text-navy-400">Send a message to start chatting about {activeContact?.propertyTitle ?? "your property"}.</p>
                    </div>
                  </div>
                )}
              </div>

              <form
                className="flex shrink-0 items-center gap-2 border-t border-navy-700/70 bg-navy-950/90 px-3 py-3 sm:gap-3 sm:px-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!draft.trim() || !user || !threadId || sendMessage.isPending) return;
                  sendMessage.mutate({ senderId: user.id, body: draft.trim() });
                  setDraft("");
                }}
              >
                <Input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a message"
                  aria-label="Message text"
                  className="h-11 min-w-0 rounded-full border-navy-700 bg-navy-900 px-4"
                />
                <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-full" disabled={!draft.trim() || sendMessage.isPending} aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="hidden h-full flex-col items-center justify-center text-center lg:flex">
              <MessageSquareText className="h-12 w-12 text-navy-600" />
              <h2 className="mt-4 text-lg font-semibold text-white">Your messages</h2>
              <p className="mt-1 text-sm text-navy-400">Choose a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
