import { MessagesView } from "@/features/messages/components/MessagesView";

export default function TenantMessagesPage() {
  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Messages</h1>
      <p className="mt-1 text-navy-300">Your conversation with your property agent.</p>
      <div className="mt-6">
        <MessagesView />
      </div>
    </div>
  );
}
