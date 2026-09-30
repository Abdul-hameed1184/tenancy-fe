import { motion } from "framer-motion";
import { CalendarCheck, CalendarClock, CheckCircle2, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useInspections } from "@/features/inspections/hooks/useInspections";
import { useConfirmInspection } from "@/features/inspections/hooks/useConfirmInspection";
import { useCompleteInspection } from "@/features/inspections/hooks/useCompleteInspection";
import { useCancelInspection } from "@/features/inspections/hooks/useCancelInspection";
import { useProperties } from "@/features/properties/hooks/useProperties";
import type { Inspection } from "@/types/entities";
import { formatDate } from "@/lib/utils";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function AgentInspectionsPage() {
  const user = useSession();
  const { data: inspections, isLoading } = useInspections({ agentId: user?.id });
  const { data: properties } = useProperties({ agentId: user?.id });
  const confirm = useConfirmInspection();
  const complete = useCompleteInspection();
  const cancel = useCancelInspection();

  const propertyTitle = (id: string) => properties?.find((p) => p.id === id)?.title ?? id;

  const total = inspections?.length ?? 0;
  const pending = inspections?.filter((i) => i.status === "requested").length ?? 0;
  const upcoming = inspections?.filter((i) => i.status === "confirmed").length ?? 0;
  const completedCount = inspections?.filter((i) => i.status === "completed").length ?? 0;

  const columns: DataTableColumn<Inspection>[] = [
    { key: "prospect", header: "Prospect", render: (i) => i.prospectName },
    { key: "property", header: "Property", render: (i) => propertyTitle(i.propertyId) },
    { key: "scheduled", header: "Scheduled", render: (i) => formatDate(i.scheduledAt) },
    { key: "status", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
    {
      key: "action",
      header: "",
      render: (i) => {
        if (i.status === "requested") {
          return (
            <div className="flex justify-end gap-2">
              <Button size="sm" onClick={() => confirm.mutate(i.id)} disabled={confirm.isPending}>
                Confirm
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => cancel.mutate(i.id)}
                disabled={cancel.isPending}
              >
                Cancel
              </Button>
            </div>
          );
        }
        if (i.status === "confirmed") {
          return (
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => complete.mutate(i.id)} disabled={complete.isPending}>
                Mark Complete
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => cancel.mutate(i.id)}
                disabled={cancel.isPending}
              >
                Cancel
              </Button>
            </div>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Inspections</h1>
      <p className="mt-1 text-navy-300">Confirm and manage prospective tenant viewings.</p>

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
              <StatCard icon={ClipboardList} label="Total Inspections" value={total} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CalendarClock} label="Pending Confirmation" value={pending} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CalendarCheck} label="Upcoming" value={upcoming} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CheckCircle2} label="Completed" value={completedCount} />
            </motion.div>
          </>
        )}
      </motion.div>

      <Card className="mt-6 p-5">
        {isLoading ? (
          <p className="text-sm text-navy-400">Loading...</p>
        ) : (
          <DataTable columns={columns} data={inspections ?? []} getRowId={(i) => i.id} emptyMessage="No inspections scheduled." />
        )}
      </Card>
    </div>
  );
}
