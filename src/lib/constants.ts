import type { Role } from "@/types/entities";

export const ROLES: Role[] = ["admin", "landlord", "agent", "tenant"];

export const ROLE_HOME_ROUTE: Record<Role, string> = {
  admin: "/admin",
  landlord: "/landlord",
  agent: "/agent",
  tenant: "/tenant",
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  landlord: "Landlord",
  agent: "Agent",
  tenant: "Tenant",
};

/**
 * Static class-string lookup, never built via dynamic Tailwind interpolation
 * (e.g. `bg-${color}-500`) since the JIT scanner can't detect those and would
 * purge them from the production build.
 */
export const STATUS_BADGE_VARIANTS = {
  // success / verified / active / occupied / completed / paid
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  // warning / pending / in_progress / medium / due
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  // danger / high / overdue / rejected
  danger: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  // info / low / new / confirmed
  info: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
  // neutral / draft / unavailable / cancelled
  neutral: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
};

type StatusVariantKey = keyof typeof STATUS_BADGE_VARIANTS;

export const STATUS_VARIANT_MAP: Record<string, StatusVariantKey> = {
  // property
  listed: "info",
  occupied: "success",
  unavailable: "neutral",
  // maintenance
  reported: "info",
  in_progress: "warning",
  completed: "success",
  // priority
  high: "danger",
  medium: "warning",
  low: "info",
  // inspection
  requested: "info",
  confirmed: "warning",
  cancelled: "neutral",
  // payment
  paid: "success",
  due: "warning",
  overdue: "danger",
  // verification
  unverified: "neutral",
  pending: "warning",
  verified: "success",
  rejected: "danger",
  // report
  open: "warning",
  resolved: "success",
  // generic
  active: "success",
};

export const NAV_ICON_KEYS = {
  agent: [
    "dashboard",
    "properties",
    "tenants",
    "maintenance",
    "inspections",
    "messages",
    "settings",
  ],
  landlord: ["overview", "properties", "agents", "finances", "reports", "settings"],
  tenant: ["home", "explore", "maintenance", "payments", "messages", "settings"],
  admin: ["overview", "verifications", "reports", "settings"],
} as const;
