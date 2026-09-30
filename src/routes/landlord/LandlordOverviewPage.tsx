import { motion } from "framer-motion";
import { Building2, DollarSign, Percent, Plus, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartPlaceholder } from "@/components/shared/ChartPlaceholder";
import { ListRow } from "@/components/shared/ListRow";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useLandlordStats } from "@/features/dashboardStats/hooks/useLandlordStats";
import { useProperties } from "@/features/properties/hooks/useProperties";
import { useAgents } from "@/features/agents/hooks/useAgents";
import { useDashboardDialogStore } from "@/stores/dashboardDialogStore";
import { formatCompactNaira } from "@/lib/utils";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function LandlordOverviewPage() {
  const user = useSession();
  const openDialog = useDashboardDialogStore((s) => s.openDialog);
  const { data: stats, isLoading: statsLoading } = useLandlordStats(user?.id);
  const { data: properties, isLoading: propsLoading } = useProperties({ landlordId: user?.id });
  const { data: agents } = useAgents();

  const featured = properties?.filter((p) => p.featured) ?? properties?.slice(0, 3);
  const agentName = (id?: string) => agents?.find((a) => a.id === id)?.name ?? "Unassigned";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white sm:text-display-md">Portfolio Overview</h1>
          <p className="mt-1 text-navy-300">
            Manage your high-value assets and monitor agent performance across Nigeria.
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
          Array.from({ length: 4 }).map((_, i) => <LoadingSkeletonCard key={i} />)
        ) : (
          <>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Wallet}
                label="Total Portfolio Value"
                value={stats.totalPortfolioValue}
                format={formatCompactNaira}
                badge={<Badge variant="success">+{stats.portfolioValueChangePct}%</Badge>}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={DollarSign}
                label="Annual Revenue"
                value={stats.annualRevenue}
                format={formatCompactNaira}
                badge={<Badge variant="info">{stats.collectionRatePct}% collection</Badge>}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Percent}
                label="Occupancy Rate"
                value={stats.occupancyRatePct}
                format={(v) => `${v}%`}
                badge={<Badge variant="warning">{stats.vacantUnits} vacant</Badge>}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Building2}
                label="Managed Assets"
                value={stats.managedAssets}
                badge={<Badge variant="neutral">Across {stats.citiesCount} cities</Badge>}
              />
            </motion.div>
          </>
        )}
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <SectionHeader title="Asset Performance" />
            <ChartPlaceholder />
          </Card>

          <Card className="p-5">
            <SectionHeader
              title="Managed Assets"
              action={
                <Link to="/landlord/properties" className="text-sm font-medium text-brand-400 hover:text-brand-300">
                  View Portfolio History
                </Link>
              }
            />
            {propsLoading && <LoadingSkeletonCard lines={2} />}
            <div className="space-y-1">
              {featured?.map((property) => (
                <ListRow
                  key={property.id}
                  thumbnail={<img src={property.photos[0]} alt="" className="h-full w-full object-cover" />}
                  title={property.title}
                  subtitle={`Managed by ${agentName(property.agentId ?? undefined)}`}
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
              {agents?.slice(0, 3).map((agent) => (
                <ListRow
                  key={agent.id}
                  title={agent.name}
                  subtitle={agent.agency}
                  trailing={<p className="text-sm font-semibold text-brand-400">{agent.trustScore}%</p>}
                />
              ))}
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

          <Card className="glow-accent p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-400">Market Insight</p>
            <p className="mt-2 text-sm text-navy-200">
              Luxury rental prices in Ikoyi have increased by 4.2% this quarter. Consider adjusting
              upcoming lease renewals.
            </p>
            <Link
              to="/landlord/finances"
              className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-400 hover:text-brand-300"
            >
              Optimize 4 Unit Prices
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
