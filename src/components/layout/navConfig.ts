import {
  CalendarCheck,
  FileWarning,
  Home,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  UserCircle2,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export const agentNavItems: NavItem[] = [
  { label: "Dashboard", to: "/agent", icon: LayoutDashboard, end: true },
  { label: "Properties", to: "/agent/properties", icon: Home },
  { label: "Tenants", to: "/agent/tenants", icon: Users },
  { label: "Maintenance", to: "/agent/maintenance", icon: Wrench },
  { label: "Inspections", to: "/agent/inspections", icon: CalendarCheck },
  { label: "Messages", to: "/agent/messages", icon: MessageSquare },
  { label: "Settings", to: "/agent/settings", icon: Settings },
];

export const landlordNavItems: NavItem[] = [
  { label: "Overview", to: "/landlord", icon: LayoutDashboard, end: true },
  { label: "My Properties", to: "/landlord/properties", icon: Home },
  { label: "Agents", to: "/landlord/agents", icon: ShieldCheck },
  { label: "Finances", to: "/landlord/finances", icon: Wallet },
  { label: "Reports", to: "/landlord/reports", icon: FileWarning },
  { label: "Settings", to: "/landlord/settings", icon: Settings },
];

export const tenantNavItems: NavItem[] = [
  { label: "My Home", to: "/tenant", icon: Home, end: true },
  { label: "Explore", to: "/tenant/explore", icon: Search },
  { label: "Maintenance", to: "/tenant/maintenance", icon: Wrench },
  { label: "Payments", to: "/tenant/payments", icon: Wallet },
  { label: "Messages", to: "/tenant/messages", icon: MessageSquare },
  { label: "Settings", to: "/tenant/settings", icon: Settings },
];

export const adminNavItems: NavItem[] = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Verifications", to: "/admin/verifications", icon: UserCircle2 },
  { label: "Reports", to: "/admin/reports", icon: FileWarning },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];
