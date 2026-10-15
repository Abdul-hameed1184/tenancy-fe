import { MapPin, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ApiError } from "@/lib/api/http";
import { useSession } from "@/features/auth/hooks/useSession";
import { useMyTenancy } from "@/features/tenants/hooks/useMyTenancy";
import { usePaymentHistory } from "@/features/payments/hooks/usePaymentHistory";
import { useMaintenanceRequests } from "@/features/maintenance/hooks/useMaintenanceRequests";
import { formatDate, formatNaira } from "@/lib/utils";

export default function TenantHomePage() {
  const user = useSession();
  const { data: tenancy, isLoading, error } = useMyTenancy(user?.id);
  const { data: payments } = usePaymentHistory(tenancy?.id);
  const { data: maintenance } = useMaintenanceRequests({ tenantId: user?.id });

  if (isLoading) {
    return <LoadingSkeletonCard lines={5} />;
  }

  const firstName = user?.name.split(" ")[0] ?? "there";

  if (!tenancy) {
    const hasNoAssignment =
      !error || (error instanceof ApiError && error.status === 404);
    return (
      <div>
        <h1 className="text-display-sm text-white sm:text-display-md">
          Welcome, {firstName}
        </h1>
        <div className="mt-6">
          <EmptyState
            message={
              hasNoAssignment
                ? "No property has been assigned to you yet."
                : "We couldn't load your tenancy right now."
            }
            hint={
              hasNoAssignment
                ? "Your property details will appear here once your landlord or agent assigns your tenancy."
                : error instanceof Error
                  ? error.message
                  : "Please try again shortly."
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white sm:text-display-md">
            Welcome Home, {firstName}
          </h1>
          <p className="mt-1 text-navy-300">
            Manage your residency at {tenancy.property.title}.
          </p>
        </div>
        <Button asChild>
          <Link to="/tenant/maintenance">
            <Wrench className="h-4 w-4" /> Request Maintenance
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <img
                src={tenancy.property.photos[0]}
                alt=""
                className="h-56 w-full object-cover sm:h-full"
              />
              <div className="p-5">
                <Badge variant="success">Active</Badge>
                <h2 className="mt-2 text-lg font-semibold text-white">
                  {tenancy.property.title}
                </h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-navy-400">
                  <MapPin className="h-3.5 w-3.5" />{" "}
                  {tenancy.property.neighborhood}, {tenancy.property.city}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-navy-400">Unit / Wing</p>
                    <p className="text-sm font-medium text-white">
                      {tenancy.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-400">Next Due Date</p>
                    <p className="text-sm font-medium text-brand-400">
                      {formatDate(tenancy.nextDueDate)}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-navy-700/60 pt-4">
                  <p className="text-sm text-navy-300">Property Agent</p>
                  <Link
                    to="/tenant/messages"
                    className="text-sm font-medium text-brand-400 hover:text-brand-300"
                  >
                    Open messages
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card className="p-5">
              <SectionHeader
                title="Maintenance"
                action={
                  <Link
                    to="/tenant/maintenance"
                    className="text-sm font-medium text-brand-400 hover:text-brand-300"
                  >
                    View All
                  </Link>
                }
              />
              {(!maintenance || maintenance.length === 0) && (
                <EmptyState message="No maintenance requests." />
              )}
              <div className="divide-y divide-navy-700/40">
                {maintenance?.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {m.issueType}
                      </p>
                      <p className="text-xs text-navy-400">
                        {formatDate(m.reportedAt)}
                      </p>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <SectionHeader
                title="Payment History"
                action={
                  <Link
                    to="/tenant/payments"
                    className="text-sm font-medium text-brand-400 hover:text-brand-300"
                  >
                    View History
                  </Link>
                }
              />
              {(!payments || payments.length === 0) && (
                <EmptyState message="No payments yet." />
              )}
              <div className="divide-y divide-navy-700/40">
                {payments?.slice(-3).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {entry.note ?? "Rent"}
                      </p>
                      <p className="text-xs text-navy-400">
                        {formatDate(entry.dueDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        {formatNaira(entry.amount)}
                      </p>
                      <StatusBadge status={entry.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
