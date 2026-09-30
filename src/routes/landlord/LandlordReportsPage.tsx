import { Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useReports } from "@/features/reports/hooks/useReports";
import { useDashboardDialogStore } from "@/stores/dashboardDialogStore";
import type { Report } from "@/types/entities";
import { formatDate } from "@/lib/utils";

export default function LandlordReportsPage() {
  const user = useSession();
  const navigate = useNavigate();
  const openDialog = useDashboardDialogStore((s) => s.openDialog);
  const { data: reports, isLoading } = useReports({ reportedById: user?.id });

  const columns: DataTableColumn<Report>[] = [
    { key: "reason", header: "Reason", render: (r) => r.reason },
    { key: "type", header: "Type", render: (r) => (r.type === "listing" ? "Listing" : "User") },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "date", header: "Filed", render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white sm:text-display-md">Reports</h1>
          <p className="mt-1 text-navy-300">Issues you've flagged to the PLEET admin team.</p>
        </div>
        <Button onClick={() => openDialog("file-report")}>
          <Flag className="h-4 w-4" /> File a Report
        </Button>
      </div>

      <Card className="mt-6 p-5">
        {isLoading ? (
          <LoadingSkeletonCard lines={3} />
        ) : (
          <DataTable
            columns={columns}
            data={reports ?? []}
            getRowId={(r) => r.id}
            onRowClick={(r) => navigate(`/landlord/reports/${r.id}`)}
            emptyMessage="You haven't filed any reports."
          />
        )}
      </Card>
    </div>
  );
}
