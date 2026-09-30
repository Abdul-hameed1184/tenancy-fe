import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAgent } from "@/features/agents/hooks/useAgent";
import { useProperties } from "@/features/properties/hooks/useProperties";
import { useDashboardDialogStore } from "@/stores/dashboardDialogStore";
import type { Property } from "@/types/entities";
import { formatCompactNaira } from "@/lib/utils";

export default function LandlordAgentDetailPage() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const user = useSession();
  const openDialog = useDashboardDialogStore((s) => s.openDialog);
  const { data: agent, isLoading } = useAgent(agentId);
  const { data: properties, isLoading: propertiesLoading } = useProperties({
    landlordId: user?.id,
    agentId,
  });

  if (isLoading || !agent) {
    return <LoadingSkeletonCard lines={5} />;
  }

  const columns: DataTableColumn<Property>[] = [
    { key: "title", header: "Property", render: (p) => p.title },
    { key: "location", header: "Location", render: (p) => `${p.neighborhood}, ${p.city}` },
    { key: "rent", header: "Annual Rent", render: (p) => formatCompactNaira(p.priceAnnual) },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
  ];

  return (
    <div>
      <Link to="/landlord/agents" className="flex items-center gap-1 text-sm text-navy-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to agents
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={agent.avatarUrl} alt={agent.name} />
            <AvatarFallback>{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-display-sm text-white">{agent.name}</h1>
            <p className="mt-1 text-navy-300">{agent.agency}</p>
          </div>
        </div>
        <StatusBadge status={agent.verificationStatus} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <SectionHeader
              title="Properties managed for you"
              action={
                <button
                  onClick={() => openDialog("assign-agent", { agentId: agent.id })}
                  className="text-sm font-medium text-brand-400 hover:text-brand-300"
                >
                  Assign to a property
                </button>
              }
            />
            {propertiesLoading ? (
              <LoadingSkeletonCard lines={3} />
            ) : (
              <DataTable
                columns={columns}
                data={properties ?? []}
                getRowId={(p) => p.id}
                onRowClick={(p) => navigate(`/landlord/properties/${p.id}`)}
                emptyMessage="This agent isn't managing any of your properties yet."
              />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <SectionHeader title="Agent Details" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-navy-400">Trust Score</dt>
                <dd>
                  <Badge variant="success">{agent.trustScore}%</Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Email</dt>
                <dd className="text-white">{agent.email}</dd>
              </div>
              {agent.phone && (
                <div className="flex justify-between">
                  <dt className="text-navy-400">Phone</dt>
                  <dd className="text-white">{agent.phone}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-navy-400">Assets Managed (platform-wide)</dt>
                <dd className="text-white">{agent.assetsManagedCount}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
