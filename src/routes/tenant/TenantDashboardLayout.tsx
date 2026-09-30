import { DashboardShell } from "@/components/layout/DashboardShell";
import { tenantNavItems } from "@/components/layout/navConfig";

export default function TenantDashboardLayout() {
  return <DashboardShell navItems={tenantNavItems} settingsPath="/tenant/settings" />;
}
