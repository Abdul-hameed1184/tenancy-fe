import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationsBellProps {
  items?: string[];
}

export function NotificationsBell({ items = [] }: NotificationsBellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-10 w-10 items-center justify-center rounded-md text-navy-300 outline-none transition-colors hover:bg-navy-800 hover:text-white">
        <Bell className="h-5 w-5" />
        {items.length > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-navy-400">No new notifications.</p>
        ) : (
          items.map((item, i) => (
            <p key={i} className="px-2 py-2 text-sm text-navy-200">
              {item}
            </p>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
