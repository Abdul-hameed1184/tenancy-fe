import { DashboardShell } from "@/components/layout/DashboardShell";
import { landlordNavItems } from "@/components/layout/navConfig";
import { AssignAgentDialog } from "@/features/properties/components/AssignAgentDialog";
import { CreatePropertyDialog } from "@/features/properties/components/CreatePropertyDialog";
import { FileReportDialog } from "@/features/reports/components/FileReportDialog";

export default function LandlordDashboardLayout() {
  return (
    <>
      <DashboardShell navItems={landlordNavItems} settingsPath="/landlord/settings" />
      <CreatePropertyDialog />
      <AssignAgentDialog />
      <FileReportDialog />
    </>
  );
}
