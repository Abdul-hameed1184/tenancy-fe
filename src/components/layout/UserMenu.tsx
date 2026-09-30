import { ChevronDown, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useSession } from "@/features/auth/hooks/useSession";
import { ROLE_LABELS } from "@/lib/constants";

export function UserMenu({ settingsPath }: { settingsPath: string }) {
  const user = useSession();
  const logout = useLogout();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 outline-none transition-colors hover:bg-navy-800">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs uppercase tracking-wide text-navy-400">{ROLE_LABELS[user.role]}</p>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <ChevronDown className="h-4 w-4 text-navy-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={settingsPath}>
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-rose-400 focus:bg-rose-500/10">
          <LogOut className="h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
