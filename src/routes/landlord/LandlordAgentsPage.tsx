import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, ShieldCheck, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAgents } from "@/features/agents/hooks/useAgents";
import { useProperties } from "@/features/properties/hooks/useProperties";
import type { AgentProfile } from "@/types/entities";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function LandlordAgentsPage() {
  const user = useSession();
  const navigate = useNavigate();
  const { data: properties, isLoading: propertiesLoading } = useProperties({
    landlordId: user?.id,
  });
  const { data: agents, isLoading: agentsLoading } = useAgents();

  const isLoading = propertiesLoading || agentsLoading;

  const myAgentIds = new Set(
    (properties ?? [])
      .map((p) => p.agentId)
      .filter((id): id is string => Boolean(id)),
  );
  const myAgents = (agents ?? []).filter((a) => myAgentIds.has(a.id));
  const managedCount = (agentId: string) =>
    (properties ?? []).filter((p) => p.agentId === agentId).length;
  const totalManagedProperties = (properties ?? []).filter((p) =>
    Boolean(p.agentId),
  ).length;
  const verifiedAgents = myAgents.filter(
    (a) => a.verificationStatus === "verified",
  ).length;
  const averageTrust = myAgents.length
    ? Math.round(
        myAgents.reduce((sum, agent) => sum + (agent.trustScore ?? 0), 0) /
          myAgents.length,
      )
    : 0;

  const columns: DataTableColumn<AgentProfile>[] = [
    {
      key: "name",
      header: "Agent",
      render: (a) => (
        <div>
          <p className="font-medium text-white">{a.name}</p>
          <p className="text-xs text-navy-400">{a.agency}</p>
        </div>
      ),
    },
    {
      key: "managed",
      header: "My Properties",
      render: (a) => `${managedCount(a.id)} managed`,
    },
    {
      key: "trust",
      header: "Trust Score",
      render: (a) => <Badge variant="success">{a.trustScore}%</Badge>,
    },
    {
      key: "verification",
      header: "Verification",
      render: (a) => <StatusBadge status={a.verificationStatus} />,
    },
  ];

  return (
    <div>
      <div>
        <h1 className="text-display-sm text-white sm:text-display-md">
          Agents
        </h1>
        <p className="mt-1 text-navy-300">
          Your assigned property managers and their active portfolio coverage.
        </p>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeletonCard key={i} />
          ))
        ) : (
          <>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Users}
                label="Total Agents"
                value={myAgents.length}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Building2}
                label="Managed Properties"
                value={totalManagedProperties}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={ShieldCheck}
                label="Verified"
                value={verifiedAgents}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Star}
                label="Avg. Trust Score"
                value={averageTrust}
                format={(value) => `${value}%`}
              />
            </motion.div>
          </>
        )}
      </motion.div>

      <Card className="mt-6 p-5">
        {isLoading ? (
          <LoadingSkeletonCard lines={3} />
        ) : (
          <DataTable
            columns={columns}
            data={myAgents}
            getRowId={(a) => a.id}
            onRowClick={(a) => navigate(`/landlord/agents/${a.id}`)}
            emptyMessage="No agents are managing your properties yet — assign one from a property's page."
          />
        )}
      </Card>
    </div>
  );
}
