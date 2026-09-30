import { DashboardShell } from "@/components/layout/DashboardShell";
import { agentNavItems } from "@/components/layout/navConfig";

export default function AgentDashboardLayout() {
  return <DashboardShell navItems={agentNavItems} settingsPath="/agent/settings" />;
}
