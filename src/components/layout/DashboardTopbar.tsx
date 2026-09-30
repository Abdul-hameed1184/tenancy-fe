import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationsBell } from "./NotificationsBell";
import { UserMenu } from "./UserMenu";

interface DashboardTopbarProps {
  settingsPath: string;
  onMenuClick: () => void;
}

export function DashboardTopbar({ settingsPath, onMenuClick }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex w-full justify-between  h-16 items-center gap-3 border-b border-navy-700/60 bg-navy-950/90 px-4 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-md text-navy-300 hover:bg-navy-800 hover:text-white lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
        <Input placeholder="Search properties, tenants, or records..." className="pl-9" />
      </div>
      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-1">
        <NotificationsBell />
        <UserMenu settingsPath={settingsPath} />
      </div>
    </header>
  );
}
