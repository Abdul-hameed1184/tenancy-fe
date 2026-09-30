import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/features/auth/hooks/useSession";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ROLE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { NavItem } from "./navConfig";

interface SidebarNavContentProps {
  navItems: NavItem[];
  onNavigate?: () => void;
}

export function SidebarNavContent({ navItems, onNavigate }: SidebarNavContentProps) {
  const user = useSession();
  const logout = useLogout();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-2 pb-6">
       <img src="/pleet-logo.png" alt="Pleet" className="h-18 w-auto" />
        <span className="text-lg font-extrabold tracking-tight text-white">PLEET</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "text-navy-950" : "text-navy-300 hover:bg-navy-800 hover:text-white",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-md bg-brand-500"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon className="relative z-10 h-4 w-4 shrink-0" />
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 space-y-1 border-t border-navy-700/60 pt-4">
        {user && (
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs uppercase tracking-wide text-navy-400">
                {ROLE_LABELS[user.role]}
              </p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
