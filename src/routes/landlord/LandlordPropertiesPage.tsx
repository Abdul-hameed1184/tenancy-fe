import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, Home, Plus, UserCheck, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAgents } from "@/features/agents/hooks/useAgents";
import { useProperties } from "@/features/properties/hooks/useProperties";
import { useDashboardDialogStore } from "@/stores/dashboardDialogStore";
import type { Property } from "@/types/entities";
import { formatCompactNaira } from "@/lib/utils";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function LandlordPropertiesPage() {
  const user = useSession();
  const navigate = useNavigate();
  const openDialog = useDashboardDialogStore((s) => s.openDialog);
  const [search, setSearch] = useState("");
  const { data: properties, isLoading } = useProperties({ landlordId: user?.id, search: search || undefined });
  const { data: agents } = useAgents();

  const agentName = (agentId?: string | null) => agents?.find((a) => a.id === agentId)?.name;

  const total = properties?.length ?? 0;
  const occupied = properties?.filter((p) => p.status === "occupied").length ?? 0;
  const vacant = properties?.filter((p) => p.status === "listed").length ?? 0;
  const withAgent = properties?.filter((p) => p.agentId).length ?? 0;

  const columns: DataTableColumn<Property>[] = [
    {
      key: "photo",
      header: "",
      render: (p) => (
        <img src={p.photos[0]} alt="" className="h-10 w-10 rounded-md object-cover" />
      ),
    },
    {
      key: "title",
      header: "Property",
      render: (p) => (
        <div>
          <p className="font-medium text-white">{p.title}</p>
          <p className="text-xs text-navy-400">
            {p.neighborhood}, {p.city}
          </p>
        </div>
      ),
    },
    {
      key: "specs",
      header: "Specs",
      render: (p) => `${p.bedrooms} bd • ${p.bathrooms} ba • ${p.sqft.toLocaleString()} sqft`,
    },
    { key: "rent", header: "Annual Rent", render: (p) => formatCompactNaira(p.priceAnnual) },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
    {
      key: "agent",
      header: "Agent",
      render: (p) => agentName(p.agentId) ?? <span className="text-navy-500">Unassigned</span>,
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            openDialog("assign-agent", { propertyId: p.id });
          }}
        >
          <UserPlus className="h-4 w-4" /> {p.agentId ? "Reassign agent" : "Assign agent"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white sm:text-display-md">My Properties</h1>
          <p className="mt-1 text-navy-300">Your full portfolio across Nigeria.</p>
        </div>
        <Button onClick={() => openDialog("create-property")}>
          <Plus className="h-4 w-4" /> List New Asset
        </Button>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <LoadingSkeletonCard key={i} />)
        ) : (
          <>
            <motion.div variants={fadeUp}>
              <StatCard icon={Building2} label="Total Properties" value={total} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CheckCircle2} label="Occupied" value={occupied} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={Home} label="Vacant / Available" value={vacant} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={UserCheck} label="Agent-Assigned" value={withAgent} />
            </motion.div>
          </>
        )}
      </motion.div>

      <Card className="mt-6 p-5">
        <Input
          placeholder="Search by title, neighborhood, or city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="mt-4">
          {isLoading ? (
            <LoadingSkeletonCard lines={4} />
          ) : (
            <DataTable
              columns={columns}
              data={properties ?? []}
              getRowId={(p) => p.id}
              onRowClick={(p) => navigate(`/landlord/properties/${p.id}`)}
              emptyMessage="No properties yet — list your first asset above."
            />
          )}
        </div>
      </Card>
    </div>
  );
}
