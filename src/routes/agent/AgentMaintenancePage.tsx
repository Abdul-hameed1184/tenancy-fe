import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ClipboardList, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useMaintenanceRequests } from "@/features/maintenance/hooks/useMaintenanceRequests";
import { useUpdateMaintenanceStatus } from "@/features/maintenance/hooks/useUpdateMaintenanceStatus";
import { useProperties } from "@/features/properties/hooks/useProperties";
import type { MaintenanceRequest, MaintenanceStatus } from "@/types/entities";
import { formatRelativeTime } from "@/lib/utils";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

const nextStatus: Record<MaintenanceStatus, MaintenanceStatus | null> = {
  reported: "in_progress",
  in_progress: "completed",
  completed: null,
};

const nextStatusLabel: Record<MaintenanceStatus, string> = {
  reported: "Start Work",
  in_progress: "Mark Complete",
  completed: "Completed",
};

export default function AgentMaintenancePage() {
  const user = useSession();
  const { data: requests, isLoading } = useMaintenanceRequests({ agentId: user?.id });
  const { data: properties } = useProperties({ agentId: user?.id });
  const updateStatus = useUpdateMaintenanceStatus();

  const propertyTitle = (id: string) => properties?.find((p) => p.id === id)?.title ?? id;

  const total = requests?.length ?? 0;
  const reported = requests?.filter((r) => r.status === "reported").length ?? 0;
  const inProgress = requests?.filter((r) => r.status === "in_progress").length ?? 0;
  const highPriorityOpen =
    requests?.filter((r) => r.priority === "high" && r.status !== "completed").length ?? 0;

  const columns: DataTableColumn<MaintenanceRequest>[] = [
    {
      key: "issue",
      header: "Issue",
      render: (r) => (
        <div>
          <p className="font-medium text-white">{r.issueType}</p>
          <p className="max-w-xs truncate text-xs text-navy-400">{r.description}</p>
        </div>
      ),
    },
    { key: "property", header: "Property", render: (r) => propertyTitle(r.propertyId) },
    { key: "priority", header: "Priority", render: (r) => <StatusBadge status={r.priority} /> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "reported", header: "Reported", render: (r) => formatRelativeTime(r.reportedAt) },
    {
      key: "action",
      header: "",
      render: (r) => {
        const next = nextStatus[r.status];
        return (
          <Button
            size="sm"
            variant="secondary"
            disabled={!next || updateStatus.isPending}
            onClick={() => next && updateStatus.mutate({ id: r.id, status: next })}
          >
            {nextStatusLabel[r.status]}
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Maintenance</h1>
      <p className="mt-1 text-navy-300">Track and resolve requests across your properties.</p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <LoadingSkeletonCard key={i} />)
        ) : (
          <>
            <motion.div variants={fadeUp}>
              <StatCard icon={ClipboardList} label="Total Requests" value={total} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={Wrench} label="New / Reported" value={reported} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CheckCircle2} label="In Progress" value={inProgress} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={AlertTriangle} label="High Priority (Open)" value={highPriorityOpen} />
            </motion.div>
          </>
        )}
      </motion.div>

      <Card className="mt-6 p-5">
        {isLoading ? (
          <p className="text-sm text-navy-400">Loading...</p>
        ) : (
          <DataTable columns={columns} data={requests ?? []} getRowId={(r) => r.id} emptyMessage="No maintenance requests." />
        )}
      </Card>
    </div>
  );
}
