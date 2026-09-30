import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useReports } from "@/features/reports/hooks/useReports";
import type { Report } from "@/types/entities";
import { formatDate } from "@/lib/utils";

export default function AdminReportsPage() {
  const { data: reports, isLoading } = useReports();
  const navigate = useNavigate();

  const columns: DataTableColumn<Report>[] = [
    { key: "reason", header: "Reason", render: (r) => r.reason },
    { key: "type", header: "Type", render: (r) => <span className="capitalize">{r.type}</span> },
    { key: "created", header: "Filed", render: (r) => formatDate(r.createdAt) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Reports</h1>
      <p className="mt-1 text-navy-300">Listings and users flagged by the community.</p>

      <Card className="mt-6 p-5">
        {isLoading ? (
          <p className="text-sm text-navy-400">Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={reports ?? []}
            getRowId={(r) => r.id}
            onRowClick={(r) => navigate(`/admin/reports/${r.id}`)}
            emptyMessage="No reports filed."
          />
        )}
      </Card>
    </div>
  );
}
