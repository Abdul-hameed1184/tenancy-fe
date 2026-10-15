import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Search, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { useProperty } from "@/features/properties/hooks/useProperty";
import { useTenancies } from "@/features/tenants/hooks/useTenancies";
import { useTenantChangeRequests } from "@/features/tenants/hooks/useTenantChangeRequests";
import {
  requestTenantAssignment,
  requestTenantRemoval,
  searchTenantCandidates,
} from "@/features/tenants/tenantRequests";
import { usePaymentHistory } from "@/features/payments/hooks/usePaymentHistory";
import { LogPaymentDialog } from "@/features/payments/components/LogPaymentDialog";
import { useMaintenanceRequests } from "@/features/maintenance/hooks/useMaintenanceRequests";
import { formatDate, formatNaira } from "@/lib/utils";
import { queryKeys } from "@/lib/queryKeys";

export default function AgentPropertyDetailPage() {
  const { propertyId } = useParams();
  const [tenantName, setTenantName] = useState("");
  const [debouncedTenantName, setDebouncedTenantName] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [unit, setUnit] = useState("");
  const [leaseStart, setLeaseStart] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const queryClient = useQueryClient();
  const { data: property, isLoading } = useProperty(propertyId);
  const { data: tenancies } = useTenancies({ propertyId });
  const tenancy = tenancies?.[0];
  const { data: tenantRequests = [] } = useTenantChangeRequests(propertyId);
  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedTenantName(tenantName.trim()),
      300,
    );
    return () => window.clearTimeout(timeoutId);
  }, [tenantName]);
  const { data: tenantCandidates = [], isFetching: searchingTenants } =
    useQuery({
      queryKey: queryKeys.tenants.candidates(
        propertyId ?? "",
        debouncedTenantName,
      ),
      queryFn: () =>
        searchTenantCandidates(propertyId as string, debouncedTenantName),
      enabled: Boolean(
        propertyId && debouncedTenantName.length >= 2 && !selectedTenant,
      ),
    });
  const { data: payments } = usePaymentHistory(tenancy?.id);
  const { data: maintenance } = useMaintenanceRequests({ propertyId });
  const refreshPropertyTenants = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all }),
      queryClient.invalidateQueries({
        queryKey: ["tenants", "requests", propertyId],
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(propertyId ?? ""),
      }),
    ]);
  };
  const assignTenant = useMutation({
    mutationFn: () =>
      requestTenantAssignment(
        propertyId as string,
        selectedTenant!.id,
        unit,
        leaseStart,
        nextDueDate,
      ),
    onSuccess: async () => {
      setSelectedTenant(null);
      setTenantName("");
      setUnit("");
      setLeaseStart("");
      setNextDueDate("");
      await refreshPropertyTenants();
      toast.success("Request sent to the landlord for approval.");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Couldn't request tenant assignment."),
  });
  const removeTenant = useMutation({
    mutationFn: (tenantId: string) =>
      requestTenantRemoval(propertyId as string, tenantId),
    onSuccess: async () => {
      await refreshPropertyTenants();
      toast.success("Removal request sent to the landlord for approval.");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Couldn't request tenant removal."),
  });

  if (isLoading || !property) {
    return <LoadingSkeletonCard lines={5} />;
  }

  return (
    <div>
      <Link
        to="/agent/properties"
        className="flex items-center gap-1 text-sm text-navy-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to properties
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white">{property.title}</h1>
          <p className="mt-1 text-navy-300">
            {property.neighborhood}, {property.city} &bull; {property.address}
          </p>
        </div>
        <StatusBadge
          status={tenancies?.length ? "occupied" : property.status}
        />
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
            {!tenancy && (
              <EmptyState message="This property is currently unoccupied." />
            )}
            {tenancy && (!payments || payments.length === 0) && (
              <EmptyState message="No payments logged yet." />
            )}
            <div className="divide-y divide-navy-700/40">
              {payments?.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {entry.note ?? "Rent payment"}
                    </p>
                    <p className="text-xs text-navy-400">
                      Due {formatDate(entry.dueDate)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatNaira(entry.amount)}
                  </p>
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
                <div
                  key={request.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {request.issueType}
                    </p>
                    <p className="text-xs text-navy-400">
                      {request.description}
                    </p>
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
                <dd className="text-white">
                  {property.sqft
                    ? `${property.sqft.toLocaleString()} sqft`
                    : "Not provided"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Annual Rent</dt>
                <dd className="text-white">
                  {formatNaira(property.priceAnnual)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Occupancy</dt>
                <dd className="text-white">{property.occupancyRate}%</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-5">
            <SectionHeader
              title="Manage Tenants"
              description="Changes take effect after landlord approval."
            />
            {tenancies && tenancies.length > 0 ? (
              <div className="divide-y divide-navy-700/50">
                {tenancies.map((current) => {
                  const removalPending = tenantRequests.some(
                    (request) =>
                      request.tenantId === current.tenantId &&
                      request.action === "remove" &&
                      request.status === "pending",
                  );
                  return (
                    <div key={current.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white">
                            {current.tenant.name}
                          </p>
                          <p className="text-xs text-navy-400">
                            Unit {current.unit}
                          </p>
                          <p className="mt-1 text-xs text-navy-400">
                            Next due {formatDate(current.nextDueDate)}
                          </p>
                        </div>
                        {removalPending ? (
                          <Badge variant="warning">Pending approval</Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={removeTenant.isPending}
                            onClick={() =>
                              removeTenant.mutate(current.tenantId)
                            }
                          >
                            <X /> Request removal
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mb-3 text-sm text-navy-400">
                No current tenants for this property.
              </p>
            )}
            <label
              className="mb-1.5 block text-xs font-medium text-navy-300"
              htmlFor="tenant-name-search"
            >
              Find a tenant by name
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <Input
                id="tenant-name-search"
                value={selectedTenant?.name ?? tenantName}
                onChange={(event) => {
                  setSelectedTenant(null);
                  setTenantName(event.target.value);
                }}
                placeholder="Start typing a tenant name"
                className="pl-9"
              />
            </div>
            {!selectedTenant &&
              tenantName.trim().length >= 2 &&
              debouncedTenantName === tenantName.trim() && (
                <div className="mt-2 max-h-40 overflow-y-auto border-y border-navy-700/60">
                  {searchingTenants ? (
                    <p className="py-3 text-sm text-navy-400">Searching...</p>
                  ) : tenantCandidates.length === 0 ? (
                    <p className="py-3 text-sm text-navy-400">
                      No available tenants found.
                    </p>
                  ) : (
                    tenantCandidates.map((candidate) => (
                      <button
                        key={candidate.id}
                        type="button"
                        onClick={() => setSelectedTenant(candidate)}
                        className="flex w-full items-center gap-2 py-2 text-left text-sm text-white hover:text-brand-300"
                      >
                        <UserRound className="h-4 w-4 text-navy-400" />{" "}
                        {candidate.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            {selectedTenant && (
              <div className="mt-4 space-y-3 border-t border-navy-700/60 pt-4">
                <p className="text-sm font-medium text-white">
                  Assigning {selectedTenant.name}
                </p>
                <label className="block text-xs text-navy-300">
                  Unit
                  <Input
                    value={unit}
                    onChange={(event) => setUnit(event.target.value)}
                    className="mt-1"
                    placeholder="e.g. Flat 2B"
                  />
                </label>
                <label className="block text-xs text-navy-300">
                  Lease start
                  <Input
                    type="date"
                    value={leaseStart}
                    onChange={(event) => setLeaseStart(event.target.value)}
                    className="mt-1"
                  />
                </label>
                <label className="block text-xs text-navy-300">
                  Next due date
                  <Input
                    type="date"
                    value={nextDueDate}
                    onChange={(event) => setNextDueDate(event.target.value)}
                    className="mt-1"
                  />
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={
                      !unit.trim() ||
                      !leaseStart ||
                      !nextDueDate ||
                      assignTenant.isPending
                    }
                    onClick={() => assignTenant.mutate()}
                  >
                    Request assignment
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedTenant(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {tenantRequests.map((request) => (
              <p
                key={request.id}
                className="mt-3 border-t border-navy-700/50 pt-3 text-xs text-amber-300"
              >
                {request.action === "assign" ? "Assignment" : "Removal"} request
                for {request.tenantName}: {request.status}.
              </p>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
