import { motion } from "framer-motion";
import { Building2, DollarSign, Percent, Plus, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ListRow } from "@/components/shared/ListRow";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useLandlordStats } from "@/features/dashboardStats/hooks/useLandlordStats";
import { useProperties } from "@/features/properties/hooks/useProperties";
import { useAgents } from "@/features/agents/hooks/useAgents";
import { useTenancies } from "@/features/tenants/hooks/useTenancies";
import { useDashboardDialogStore } from "@/stores/dashboardDialogStore";
import { formatCompactNaira } from "@/lib/utils";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function LandlordOverviewPage() {
  const user = useSession();
  const openDialog = useDashboardDialogStore((s) => s.openDialog);
  const { data: stats, isLoading: statsLoading } = useLandlordStats(user?.id);
  const { data: properties, isLoading: propsLoading } = useProperties({
    landlordId: user?.id,
  });
  const { data: tenancies } = useTenancies({ landlordId: user?.id });
  const { data: agents } = useAgents();

  const managedProperties = properties ?? [];
  const occupiedPropertyIds = new Set(
    (tenancies ?? []).map((tenancy) => tenancy.propertyId),
  );
  const occupiedProperties = managedProperties.filter((property) =>
    occupiedPropertyIds.has(property.id),
  ).length;
  const vacantProperties = managedProperties.length - occupiedProperties;
  const annualRevenue = stats?.annualRevenue ?? 0;
  const agentName = (id?: string) =>
    agents?.find((a) => a.id === id)?.name ?? "Unassigned";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white sm:text-display-md">
            Portfolio Overview
          </h1>
          <p className="mt-1 text-navy-300">
            Manage your high-value assets and monitor agent performance across
            Nigeria.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Export Tax Report</Button>
          <Button onClick={() => openDialog("create-property")}>
            <Plus className="h-4 w-4" /> List New Asset
          </Button>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statsLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeletonCard key={i} />
          ))
        ) : (
          <>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Wallet}
                label="Annual Rent Roll"
                value={stats.totalPortfolioValue}
                format={formatCompactNaira}
                badge={
                  <Badge variant="info">
                    {stats.portfolioValueChangePct >= 0 ? "+" : ""}
                    {stats.portfolioValueChangePct}% this month
                  </Badge>
                }
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={DollarSign}
                label="Annual Revenue"
                value={stats.annualRevenue}
                format={formatCompactNaira}
                badge={
                  <Badge variant="info">
                    {stats.collectionRatePct}% collected
                  </Badge>
                }
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Percent}
                label="Occupancy Rate"
                value={stats.occupancyRatePct}
                format={(v) => `${v}%`}
                badge={
                  <Badge variant="warning">
                    {stats.vacantUnits} vacant properties
                  </Badge>
                }
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Building2}
                label="Managed Assets"
                value={stats.managedAssets}
                badge={
                  <Badge variant="neutral">
                    Across {stats.citiesCount} cities
                  </Badge>
                }
              />
            </motion.div>
          </>
        )}
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <SectionHeader
              title="Asset Performance"
              description="Live occupancy from current tenancy records."
            />
            {propsLoading ? (
              <LoadingSkeletonCard lines={2} />
            ) : managedProperties.length === 0 ? (
              <p className="py-4 text-sm text-navy-400">
                No properties in your portfolio yet.
              </p>
            ) : (
              <div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-navy-300">Occupied properties</span>
                  <span className="font-semibold text-white">
                    {occupiedProperties} / {managedProperties.length}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy-800">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-[width]"
                    style={{
                      width: `${managedProperties.length ? (occupiedProperties / managedProperties.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                  <span className="text-emerald-300">
                    {occupiedProperties} occupied
                  </span>
                  <span className="text-amber-300">
                    {vacantProperties} vacant
                  </span>
                  <span className="text-navy-400">
                    {formatCompactNaira(annualRevenue)} received this year
                  </span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <SectionHeader
              title="Managed Assets"
              action={
                <Link
                  to="/landlord/properties"
                  className="text-sm font-medium text-brand-400 hover:text-brand-300"
                >
                  View Portfolio History
                </Link>
              }
            />
            {propsLoading && <LoadingSkeletonCard lines={2} />}
            <div className="space-y-1">
              {managedProperties.slice(0, 5).map((property) => (
                <ListRow
                  key={property.id}
                  thumbnail={
                    <img
                      src={property.photos[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  }
                  title={property.title}
                  subtitle={`Managed by ${agentName(property.agentId ?? undefined)} · ${occupiedPropertyIds.has(property.id) ? (tenancies?.filter((tenancy) => tenancy.propertyId === property.id).length ?? 0) + " current tenant(s)" : "No current tenant"}`}
                  showChevron
                  trailing={
                    <>
                      <div className="text-right">
                        <p className="text-xs text-navy-400">Annual Rev</p>
                        <p className="text-sm font-semibold text-white">
                          {formatCompactNaira(property.priceAnnual)}
                        </p>
                      </div>
                      <StatusBadge status={property.status} />
                    </>
                  }
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <SectionHeader title="Agent Performance" />
            <div className="space-y-1">
              {agents
                ?.filter((agent) =>
                  managedProperties.some(
                    (property) => property.agentId === agent.id,
                  ),
                )
                .slice(0, 5)
                .map((agent) => {
                  const agentProperties = managedProperties.filter(
                    (property) => property.agentId === agent.id,
                  );
                  const agentTenants = (tenancies ?? []).filter((tenancy) =>
                    agentProperties.some(
                      (property) => property.id === tenancy.propertyId,
                    ),
                  ).length;
                  return (
                    <Link
                      key={agent.id}
                      to={`/landlord/agents/${agent.id}`}
                      className="block rounded-md hover:bg-navy-800/50"
                    >
                      <ListRow
                        title={agent.name}
                        subtitle={`${agentProperties.length} managed properties · ${agentTenants} current tenants`}
                        trailing={
                          <span className="text-xs text-brand-300">
                            View details
                          </span>
                        }
                      />
                    </Link>
                  );
                })}
              {!propsLoading &&
                !managedProperties.some((property) => property.agentId) && (
                  <p className="py-3 text-sm text-navy-400">
                    No agents currently manage your properties.
                  </p>
                )}
            </div>
            <div className="mt-3 border-t border-navy-700/60 pt-3">
              <Link
                to="/landlord/agents"
                className="text-sm font-medium text-brand-400 hover:text-brand-300"
              >
                Assign New Agent
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
