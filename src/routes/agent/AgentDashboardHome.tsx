import { motion } from "framer-motion";
import { CalendarCheck, ClipboardList, Home, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ListRow } from "@/components/shared/ListRow";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TrustScoreCard } from "@/components/shared/TrustScoreCard";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAgent } from "@/features/agents/hooks/useAgent";
import { useAgentStats } from "@/features/dashboardStats/hooks/useAgentStats";
import { useTopPerformingProperties } from "@/features/properties/hooks/useTopPerformingProperties";
import { useMaintenanceRequests } from "@/features/maintenance/hooks/useMaintenanceRequests";
import { useInspections } from "@/features/inspections/hooks/useInspections";
import { useProperties } from "@/features/properties/hooks/useProperties";
import { formatCompactNaira, formatRelativeTime, formatDate } from "@/lib/utils";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function AgentDashboardHome() {
  const user = useSession();
  const navigate = useNavigate();
  const { data: agent } = useAgent(user?.id);
  const { data: stats, isLoading: statsLoading } = useAgentStats(user?.id);
  const { data: topProperties, isLoading: topLoading } = useTopPerformingProperties(user?.id);
  const { data: maintenance, isLoading: maintLoading } = useMaintenanceRequests({ agentId: user?.id });
  const { data: inspections, isLoading: inspLoading } = useInspections({
    agentId: user?.id,
    status: "confirmed",
  });
  const { data: allProperties } = useProperties({ agentId: user?.id });

  const firstName = user?.name.split(" ")[0] ?? "there";
  const pendingMaintenance = maintenance?.filter((m) => m.status !== "completed") ?? [];
  const propertyTitle = (propertyId: string) =>
    allProperties?.find((p) => p.id === propertyId)?.title ?? propertyId;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white sm:text-display-md">Agent Command Center</h1>
          <p className="mt-1 text-navy-300">
            Good morning, {firstName}. Here's what's happening across your managed properties.
          </p>
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
              <StatCard icon={Home} label="Active Properties" value={stats.activeProperties} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={Users} label="Total Tenants" value={stats.totalTenants} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={ClipboardList}
                label="Maintenance"
                value={stats.maintenancePending}
                badge={
                  stats.maintenanceHighPriority > 0 && (
                    <Badge variant="danger">{stats.maintenanceHighPriority} high priority</Badge>
                  )
                }
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CalendarCheck} label="Inspections" value={stats.upcomingInspections} />
            </motion.div>
          </>
        )}
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <SectionHeader
              title="Top Performing Properties"
              action={
                <Link to="/agent/properties" className="text-sm font-medium text-brand-400 hover:text-brand-300">
                  View All Properties
                </Link>
              }
            />
            <div className="space-y-1">
              {topLoading && Array.from({ length: 3 }).map((_, i) => <LoadingSkeletonCard key={i} lines={1} />)}
              {topProperties?.map((property) => (
                <ListRow
                  key={property.id}
                  thumbnail={<img src={property.photos[0]} alt="" className="h-full w-full object-cover" />}
                  title={property.title}
                  subtitle={`${property.neighborhood}, ${property.city}`}
                  showChevron
                  onClick={() => navigate(`/agent/properties/${property.id}`)}
                  trailing={
                    <>
                      <div className="text-right">
                        <p className="text-xs text-navy-400">Occupancy</p>
                        <p className="text-sm font-semibold text-brand-400">{property.occupancyRate}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-navy-400">Revenue</p>
                        <p className="text-sm font-semibold text-white">
                          {formatCompactNaira(property.priceAnnual)}/yr
                        </p>
                      </div>
                    </>
                  }
                />
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Recent Maintenance" action={<Badge variant="warning">{pendingMaintenance.length} Pending</Badge>} />
            {maintLoading && <LoadingSkeletonCard lines={3} />}
            <div className="divide-y divide-navy-700/40">
              {pendingMaintenance.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{request.issueType}</p>
                    <p className="text-xs text-navy-400">{propertyTitle(request.propertyId)}</p>
                  </div>
                  <StatusBadge status={request.priority} />
                  <p className="text-xs text-navy-400">{formatRelativeTime(request.reportedAt)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {agent && <TrustScoreCard trustScore={agent.trustScore} />}

          <Card className="p-5">
            <SectionHeader
              title="Upcoming Inspections"
              action={
                <Link to="/agent/inspections" className="text-sm font-medium text-brand-400 hover:text-brand-300">
                  View All Inspections
                </Link>
              }
            />
            {inspLoading && <LoadingSkeletonCard lines={2} />}
            <div className="space-y-3">
              {inspections?.slice(0, 3).map((inspection) => (
                <div key={inspection.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <div>
                    <p className="text-xs font-medium text-brand-400">
                      {formatDate(inspection.scheduledAt)}
                    </p>
                    <p className="text-sm text-white">Prospective: {inspection.prospectName}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
