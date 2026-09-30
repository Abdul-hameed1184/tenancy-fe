import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { useProperty } from "@/features/properties/hooks/useProperty";
import { useTenancies } from "@/features/tenants/hooks/useTenancies";
import { usePaymentHistory } from "@/features/payments/hooks/usePaymentHistory";
import { LogPaymentDialog } from "@/features/payments/components/LogPaymentDialog";
import { useMaintenanceRequests } from "@/features/maintenance/hooks/useMaintenanceRequests";
import { formatDate, formatNaira } from "@/lib/utils";

export default function AgentPropertyDetailPage() {
  const { propertyId } = useParams();
  const { data: property, isLoading } = useProperty(propertyId);
  const { data: tenancies } = useTenancies({ propertyId });
  const tenancy = tenancies?.[0];
  const { data: payments } = usePaymentHistory(tenancy?.id);
  const { data: maintenance } = useMaintenanceRequests({ propertyId });

  if (isLoading || !property) {
    return <LoadingSkeletonCard lines={5} />;
  }

  return (
    <div>
      <Link to="/agent/properties" className="flex items-center gap-1 text-sm text-navy-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to properties
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white">{property.title}</h1>
          <p className="mt-1 text-navy-300">
            {property.neighborhood}, {property.city} &bull; {property.address}
          </p>
        </div>
        <StatusBadge status={property.status} />
      </div>

      <img
        src={property.photos[0]}
        alt={property.title}
        className="mt-6 h-64 w-full rounded-lg object-cover"
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <SectionHeader
              title="Payment History"
              action={tenancy && <LogPaymentDialog tenancyId={tenancy.id} />}
            />
            {!tenancy && <EmptyState message="This property is currently unoccupied." />}
            {tenancy && (!payments || payments.length === 0) && (
              <EmptyState message="No payments logged yet." />
            )}
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

          <Card className="p-5">
            <SectionHeader title="Maintenance Requests" />
            {(!maintenance || maintenance.length === 0) && (
              <EmptyState message="No maintenance requests for this property." />
            )}
            <div className="divide-y divide-navy-700/40">
              {maintenance?.map((request) => (
                <div key={request.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{request.issueType}</p>
                    <p className="text-xs text-navy-400">{request.description}</p>
                  </div>
                  <StatusBadge status={request.priority} />
                  <StatusBadge status={request.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <SectionHeader title="Property Details" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-navy-400">Bedrooms</dt>
                <dd className="text-white">{property.bedrooms}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Bathrooms</dt>
                <dd className="text-white">{property.bathrooms}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Size</dt>
                <dd className="text-white">{property.sqft.toLocaleString()} sqft</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Annual Rent</dt>
                <dd className="text-white">{formatNaira(property.priceAnnual)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Occupancy</dt>
                <dd className="text-white">{property.occupancyRate}%</dd>
              </div>
            </dl>
          </Card>

          {tenancy && (
            <Card className="p-5">
              <SectionHeader title="Current Tenant" />
              <p className="text-sm font-medium text-white">{tenancy.tenant.name}</p>
              <p className="text-xs text-navy-400">{tenancy.tenant.email}</p>
              <p className="mt-3 text-xs text-navy-400">Unit</p>
              <p className="text-sm text-white">{tenancy.unit}</p>
              <p className="mt-3 text-xs text-navy-400">Next Due Date</p>
              <Badge variant="warning">{formatDate(tenancy.nextDueDate)}</Badge>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
