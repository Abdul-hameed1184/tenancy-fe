import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useVerificationQueue } from "@/features/agents/hooks/useVerificationQueue";
import type { AgentProfile } from "@/types/entities";
import { formatDate } from "@/lib/utils";

export default function AdminVerificationQueuePage() {
  const { data: agents, isLoading } = useVerificationQueue();
  const navigate = useNavigate();

  const columns: DataTableColumn<AgentProfile>[] = [
    { key: "name", header: "Agent", render: (a) => a.name },
    { key: "agency", header: "Agency", render: (a) => a.agency },
    { key: "email", header: "Email", render: (a) => a.email },
    { key: "applied", header: "Applied", render: (a) => formatDate(a.createdAt) },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.verificationStatus} /> },
  ];

  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Verification Queue</h1>
      <p className="mt-1 text-navy-300">Agents awaiting passport and third-party identity checks.</p>

      <Card className="mt-6 p-5">
        {isLoading ? (
          <p className="text-sm text-navy-400">Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={agents ?? []}
            getRowId={(a) => a.id}
            onRowClick={(a) => navigate(`/admin/verifications/${a.id}`)}
            emptyMessage="No pending verifications."
          />
        )}
      </Card>
    </div>
  );
}
