import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Percent, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { RevenueChart } from "@/components/shared/RevenueChart";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { summarizeTenancyPayments } from "@/features/payments/utils";
import { useTenancies } from "@/features/tenants/hooks/useTenancies";
import type { TenancyDetail } from "@/features/tenants/types";
import type { PaymentStatus } from "@/types/entities";
import { formatCompactNaira, formatDate, formatNaira } from "@/lib/utils";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

function latestStatus(tenancy: TenancyDetail): PaymentStatus | undefined {
  return tenancy.paymentHistory[tenancy.paymentHistory.length - 1]?.status;
}

export default function LandlordFinancesPage() {
  const user = useSession();
  const { data: tenancies, isLoading } = useTenancies({ landlordId: user?.id });
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("all");

  const summary = useMemo(() => summarizeTenancyPayments(tenancies ?? []), [tenancies]);
  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? (tenancies ?? [])
        : (tenancies ?? []).filter((t) => latestStatus(t) === statusFilter),
    [tenancies, statusFilter],
  );

  const columns: DataTableColumn<TenancyDetail>[] = [
    { key: "property", header: "Property", render: (t) => t.property.title },
    { key: "tenant", header: "Tenant", render: (t) => t.tenant.name },
    {
      key: "lastPayment",
      header: "Last Payment",
      render: (t) => {
        const last = t.paymentHistory[t.paymentHistory.length - 1];
        return last ? formatNaira(last.amount) : "—";
      },
    },
    { key: "nextDue", header: "Next Due", render: (t) => formatDate(t.nextDueDate) },
    {
      key: "status",
      header: "Status",
      render: (t) => {
        const status = latestStatus(t);
        return status ? <StatusBadge status={status} /> : "—";
      },
    },
  ];

  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Finances</h1>
      <p className="mt-1 text-navy-300">Rent collection status across your portfolio.</p>

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
              <StatCard icon={Wallet} label="Total Revenue" value={summary.totalRevenue} format={formatCompactNaira} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={AlertTriangle}
                label="Outstanding"
                value={summary.outstanding}
                format={formatCompactNaira}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Percent}
                label="Collection Rate"
                value={summary.collectionRatePct}
                format={(v) => `${v}%`}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CheckCircle2} label="Overdue Payments" value={summary.overdueCount} />
            </motion.div>
          </>
        )}
      </motion.div>

      <Card className="mt-6 p-5">
        <SectionHeader title="Revenue Trend" description="Collected payments over the last 6 months" />
        <RevenueChart data={summary.monthlySeries} />
      </Card>

      <Card className="mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeader title="Tenancies" />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | PaymentStatus)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="due">Due</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isLoading ? (
          <p className="text-sm text-navy-400">Loading...</p>
        ) : (
          <DataTable columns={columns} data={filtered} getRowId={(t) => t.id} emptyMessage="No tenancies yet." />
        )}
      </Card>
    </div>
  );
}
