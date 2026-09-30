import { DashboardShell } from "@/components/layout/DashboardShell";
import { adminNavItems } from "@/components/layout/navConfig";

export default function AdminDashboardLayout() {
  return <DashboardShell navItems={adminNavItems} settingsPath="/admin/settings" />;
}
