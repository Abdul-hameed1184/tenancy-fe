import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useProperty } from "@/features/properties/hooks/useProperty";
import { useTenancies } from "@/features/tenants/hooks/useTenancies";
import { usePaymentHistory } from "@/features/payments/hooks/usePaymentHistory";
import { useAgent } from "@/features/agents/hooks/useAgent";
import { useDashboardDialogStore } from "@/stores/dashboardDialogStore";
import { formatDate, formatNaira } from "@/lib/utils";

export default function LandlordPropertyDetailPage() {
  const { propertyId } = useParams();
  const openDialog = useDashboardDialogStore((s) => s.openDialog);
  const { data: property, isLoading } = useProperty(propertyId);
  const { data: tenancies } = useTenancies({ propertyId });
  const tenancy = tenancies?.[0];
  const { data: payments } = usePaymentHistory(tenancy?.id);
  const { data: agent } = useAgent(property?.agentId ?? undefined);

  if (isLoading || !property) {
    return <LoadingSkeletonCard lines={5} />;
  }

  return (
    <div>
      <Link to="/landlord/properties" className="flex items-center gap-1 text-sm text-navy-400 hover:text-white">
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

      <img src={property.photos[0]} alt={property.title} className="mt-6 h-64 w-full rounded-lg object-cover" />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <SectionHeader title="Payment History" description="Read-only — logged by your assigned agent." />
            {tenancy && (!payments || payments.length === 0) && <EmptyState message="No payments logged yet." />}
            {!tenancy && <EmptyState message="This property is currently unoccupied." />}
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

        <div className="space-y-6">
          <Card className="p-5">
            <SectionHeader title="Property Details" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-navy-400">Annual Rent</dt>
                <dd className="text-white">{formatNaira(property.priceAnnual)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Occupancy</dt>
                <dd className="text-white">{property.occupancyRate}%</dd>
              </div>
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
                <dt className="text-navy-400">State</dt>
                <dd className="text-white">{property.state}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Managing Agent" />
            {agent ? (
              <>
                <p className="text-sm font-medium text-white">{agent.name}</p>
                <p className="text-xs text-navy-400">{agent.agency}</p>
                <Badge variant="success" className="mt-3">
                  Trust Score {agent.trustScore}%
                </Badge>
                <div className="mt-4">
                  <button
                    onClick={() => openDialog("assign-agent", { propertyId: property.id })}
                    className="text-sm font-medium text-brand-400 hover:text-brand-300"
                  >
                    Reassign agent
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-navy-400">No agent assigned to this property yet.</p>
                <div className="mt-4">
                  <Button size="sm" onClick={() => openDialog("assign-agent", { propertyId: property.id })}>
                    Assign agent
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
