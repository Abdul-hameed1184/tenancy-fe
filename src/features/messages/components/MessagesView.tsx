import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { useSession } from "@/features/auth/hooks/useSession";
import { formatRelativeTime } from "@/lib/utils";
import { useThreads } from "../hooks/useThreads";
import { useThreadMessages } from "../hooks/useThreadMessages";
import { useSendMessage } from "../hooks/useSendMessage";

export function MessagesView() {
  const user = useSession();
  const { data: threads, isLoading } = useThreads(user?.id);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>();
  const threadId = activeThreadId ?? threads?.[0]?.id;
  const { data: messages } = useThreadMessages(threadId);
  const sendMessage = useSendMessage(threadId ?? "");
  const [draft, setDraft] = useState("");

  if (!isLoading && (!threads || threads.length === 0)) {
    return <EmptyState message="No conversations yet." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <Card className="p-2">
        {threads?.map((thread) => (
          <button
            key={thread.id}
            onClick={() => setActiveThreadId(thread.id)}
            className={`w-full rounded-md p-3 text-left text-sm transition-colors ${
              thread.id === threadId ? "bg-navy-800 text-white" : "text-navy-300 hover:bg-navy-800/60"
            }`}
          >
            <p className="font-medium">Conversation</p>
            <p className="text-xs text-navy-400">{formatRelativeTime(thread.lastMessageAt)}</p>
          </button>
        ))}
      </Card>

      <Card className="flex h-[28rem] flex-col p-4">
        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin">
          {messages?.map((message) => {
            const isMine = message.senderId === user?.id;
            return (
              <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                    isMine ? "bg-brand-500 text-navy-950" : "bg-navy-800 text-white"
                  }`}
                >
                  {message.body}
                </div>
              </div>
            );
          })}
        </div>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim() || !user || !threadId) return;
            sendMessage.mutate({ senderId: user.id, body: draft.trim() });
            setDraft("");
          }}
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="submit" size="icon" disabled={!threadId}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
