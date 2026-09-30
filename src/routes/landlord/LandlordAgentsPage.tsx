import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAgents } from "@/features/agents/hooks/useAgents";
import { useProperties } from "@/features/properties/hooks/useProperties";
import type { AgentProfile } from "@/types/entities";

export default function LandlordAgentsPage() {
  const user = useSession();
  const navigate = useNavigate();
  const { data: properties, isLoading: propertiesLoading } = useProperties({ landlordId: user?.id });
  const { data: agents, isLoading: agentsLoading } = useAgents({ verificationStatus: "verified" });

  const isLoading = propertiesLoading || agentsLoading;

  const myAgentIds = new Set(
    (properties ?? []).map((p) => p.agentId).filter((id): id is string => Boolean(id)),
  );
  const myAgents = (agents ?? []).filter((a) => myAgentIds.has(a.id));
  const managedCount = (agentId: string) =>
    (properties ?? []).filter((p) => p.agentId === agentId).length;

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
    { key: "managed", header: "My Properties", render: (a) => `${managedCount(a.id)} managed` },
    { key: "trust", header: "Trust Score", render: (a) => <Badge variant="success">{a.trustScore}%</Badge> },
    {
      key: "verification",
      header: "Verification",
      render: (a) => <StatusBadge status={a.verificationStatus} />,
    },
  ];

  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Agents</h1>
      <p className="mt-1 text-navy-300">Agents currently managing your properties.</p>

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
