import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DashboardTopbar } from "./DashboardTopbar";
import type { NavItem } from "./navConfig";
import { PageTransition } from "./PageTransition";
import { SidebarNavContent } from "./SidebarNavContent";

interface DashboardShellProps {
  navItems: NavItem[];
  settingsPath: string;
}

export function DashboardShell({ navItems, settingsPath }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-navy-700/60 bg-navy-900/60 p-4 lg:flex">
        <SidebarNavContent navItems={navItems} />
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-4">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <SidebarNavContent navItems={navItems} onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <DashboardTopbar settingsPath={settingsPath} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <PageTransition />
        </main>
      </div>
    </div>
  );
}
