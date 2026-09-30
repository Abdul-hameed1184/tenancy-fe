import { motion } from "framer-motion";
import { AlertCircle, CalendarClock, CheckCircle2, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useMyTenancy } from "@/features/tenants/hooks/useMyTenancy";
import { usePaymentHistory } from "@/features/payments/hooks/usePaymentHistory";
import { daysUntil, formatDate, formatNaira } from "@/lib/utils";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function TenantPaymentsPage() {
  const user = useSession();
  const { data: tenancy } = useMyTenancy(user?.id);
  const { data: payments, isLoading } = usePaymentHistory(tenancy?.id);

  const totalPaid = payments?.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0) ?? 0;
  const outstanding =
    payments?.filter((p) => p.status === "due" || p.status === "overdue").reduce((sum, p) => sum + p.amount, 0) ?? 0;
  const paymentsMade = payments?.filter((p) => p.status === "paid").length ?? 0;
  const hasOverdue = payments?.some((p) => p.status === "overdue") ?? false;
  const daysUntilDue = tenancy ? daysUntil(tenancy.nextDueDate) : 0;

  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Payments</h1>
      <p className="mt-1 text-navy-300">Your full rent payment history, logged by your agent.</p>

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
              <StatCard icon={Wallet} label="Total Paid" value={totalPaid} format={formatNaira} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={AlertCircle}
                label="Outstanding"
                value={outstanding}
                format={formatNaira}
                badge={hasOverdue ? <StatusBadge status="overdue" /> : undefined}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CheckCircle2} label="Payments Made" value={paymentsMade} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={CalendarClock}
                label="Days Until Next Due"
                value={daysUntilDue}
                format={(v) => (v < 0 ? `${Math.abs(v)}d overdue` : `${v}d`)}
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {tenancy && (
        <Card className="mt-6 p-5">
          <SectionHeader title="Lease Details" />
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between sm:block">
              <dt className="text-navy-400">Property</dt>
              <dd className="text-white sm:mt-0.5">{tenancy.property.title}</dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-navy-400">Unit</dt>
              <dd className="text-white sm:mt-0.5">{tenancy.unit}</dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-navy-400">Lease Start</dt>
              <dd className="text-white sm:mt-0.5">{formatDate(tenancy.leaseStart)}</dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-navy-400">Next Due Date</dt>
              <dd className="text-white sm:mt-0.5">{formatDate(tenancy.nextDueDate)}</dd>
            </div>
          </dl>
        </Card>
      )}

      <Card className="mt-6 p-5">
        <SectionHeader title="Payment History" />
        {isLoading && <LoadingSkeletonCard lines={4} />}
        {!isLoading && payments?.length === 0 && <EmptyState message="No payments logged yet." />}
        <div className="divide-y divide-navy-700/40">
          {payments?.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-white">{entry.note ?? "Rent payment"}</p>
                <p className="text-xs text-navy-400">Due {formatDate(entry.dueDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{formatNaira(entry.amount)}</p>
                <StatusBadge status={entry.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
