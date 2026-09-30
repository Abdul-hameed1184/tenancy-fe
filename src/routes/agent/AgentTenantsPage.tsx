import { motion } from "framer-motion";
import { AlertCircle, CalendarClock, CheckCircle2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useTenancies } from "@/features/tenants/hooks/useTenancies";
import type { TenancyDetail } from "@/features/tenants/types";
import { formatDate } from "@/lib/utils";
import { getDueBucket } from "@/features/payments/hooks/useRentDueReminders";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function AgentTenantsPage() {
  const user = useSession();
  const navigate = useNavigate();
  const { data: tenancies, isLoading } = useTenancies({ agentId: user?.id });

  const total = tenancies?.length ?? 0;
  const buckets = tenancies?.map((t) => getDueBucket(t.nextDueDate)) ?? [];
  const overdue = buckets.filter((b) => b === "overdue").length;
  const dueSoon = buckets.filter((b) => b === "due-30").length;
  const current = buckets.filter((b) => b === "not-due" || b === "due-60" || b === "due-90").length;

  const columns: DataTableColumn<TenancyDetail>[] = [
    { key: "tenant", header: "Tenant", render: (t) => t.tenant.name },
    { key: "property", header: "Property", render: (t) => t.property.title },
    { key: "unit", header: "Unit", render: (t) => t.unit },
    { key: "nextDue", header: "Next Due", render: (t) => formatDate(t.nextDueDate) },
    {
      key: "status",
      header: "Status",
      render: (t) => {
        const bucket = getDueBucket(t.nextDueDate);
        return <StatusBadge status={bucket === "not-due" ? "paid" : bucket === "overdue" ? "overdue" : "due"} />;
      },
    },
  ];

  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Tenants</h1>
      <p className="mt-1 text-navy-300">Every tenant across your managed properties.</p>

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
              <StatCard icon={Users} label="Total Tenants" value={total} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CheckCircle2} label="Current" value={current} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CalendarClock} label="Rent Due Soon" value={dueSoon} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={AlertCircle} label="Overdue" value={overdue} />
            </motion.div>
          </>
        )}
      </motion.div>

      <Card className="mt-6 p-5">
        {isLoading ? (
          <p className="text-sm text-navy-400">Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={tenancies ?? []}
            getRowId={(t) => t.id}
            onRowClick={(t) => navigate(`/agent/tenants/${t.id}`)}
            emptyMessage="No tenants yet."
          />
        )}
      </Card>
    </div>
  );
}
