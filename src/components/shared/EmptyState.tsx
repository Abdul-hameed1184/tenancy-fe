import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
  hint?: string;
}

export function EmptyState({ icon: Icon = Inbox, message, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-navy-700 py-10 text-center">
      <Icon className="h-6 w-6 text-navy-500" />
      <p className="text-sm font-medium text-navy-300">{message}</p>
      {hint && <p className="text-xs text-navy-500">{hint}</p>}
    </div>
  );
}
