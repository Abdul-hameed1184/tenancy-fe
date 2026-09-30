import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useTenancy } from "@/features/tenants/hooks/useTenancy";
import { usePaymentHistory } from "@/features/payments/hooks/usePaymentHistory";
import { LogPaymentDialog } from "@/features/payments/components/LogPaymentDialog";
import { formatDate, formatNaira } from "@/lib/utils";

export default function AgentTenantDetailPage() {
  const { tenantId: tenancyId } = useParams();
  const { data: tenancy, isLoading } = useTenancy(tenancyId);
  const { data: payments } = usePaymentHistory(tenancyId);

  if (isLoading || !tenancy) {
    return <LoadingSkeletonCard lines={5} />;
  }

  return (
    <div>
      <Link to="/agent/tenants" className="flex items-center gap-1 text-sm text-navy-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to tenants
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white">{tenancy.tenant.name}</h1>
          <p className="mt-1 text-navy-300">
            {tenancy.property.title} &bull; Unit {tenancy.unit}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <SectionHeader
              title="Payment History"
              action={<LogPaymentDialog tenancyId={tenancy.id} />}
            />
            {(!payments || payments.length === 0) && <EmptyState message="No payments logged yet." />}
            <div className="divide-y divide-navy-700/40">
              {payments?.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{entry.note ?? "Rent payment"}</p>
                    <p className="text-xs text-navy-400">Due {formatDate(entry.dueDate)}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">{formatNaira(entry.amount)}</p>
                  <StatusBadge status={entry.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-5">
            <SectionHeader title="Tenant Details" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-navy-400">Email</dt>
                <dd className="text-white">{tenancy.tenant.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Lease Start</dt>
                <dd className="text-white">{formatDate(tenancy.leaseStart)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Next Due</dt>
                <dd className="text-white">{formatDate(tenancy.nextDueDate)}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
