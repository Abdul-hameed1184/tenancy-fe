import { motion } from "framer-motion";
import { useState } from "react";
import { Building2, CheckCircle2, Home, UserRound, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { useSession } from "@/features/auth/hooks/useSession";
import { useProperties } from "@/features/properties/hooks/useProperties";
import { useTenancies } from "@/features/tenants/hooks/useTenancies";
import { useAgent } from "@/features/agents/hooks/useAgent";
import { formatCompactNaira } from "@/lib/utils";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function AgentPropertiesPage() {
  const user = useSession();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: properties, isLoading } = useProperties({ agentId: user?.id });
  const { data: tenancies, isLoading: tenanciesLoading } = useTenancies({
    agentId: user?.id,
  });
  const { data: agent } = useAgent(user?.id);

  const currentProperties = properties ?? [];
  const occupiedPropertyIds = new Set(
    (tenancies ?? []).map((tenancy) => tenancy.propertyId),
  );
  const occupied = currentProperties.filter((property) =>
    occupiedPropertyIds.has(property.id),
  ).length;
  const vacant = currentProperties.length - occupied;
  const rentRoll = currentProperties.reduce(
    (sum, property) => sum + property.priceAnnual,
    0,
  );
  const filteredProperties = currentProperties.filter((property) =>
    `${property.title} ${property.neighborhood} ${property.city}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white sm:text-display-md">
            My Properties
          </h1>
          <p className="mt-1 text-navy-300">
            Your managed portfolio and current tenancies.
          </p>
        </div>
        {agent && (
          <Card className="flex min-w-64 items-center gap-3 p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/15 text-brand-300">
              <UserRound className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {agent.name}
              </p>
              <p className="truncate text-xs text-navy-400">
                {agent.agency || agent.email}
              </p>
              <Badge
                variant={
                  agent.verificationStatus === "verified"
                    ? "success"
                    : "warning"
                }
                className="mt-1"
              >
                {agent.verificationStatus}
              </Badge>
            </div>
          </Card>
        )}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {isLoading || tenanciesLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeletonCard key={i} />
          ))
        ) : (
          <>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Building2}
                label="Managed Properties"
                value={currentProperties.length}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CheckCircle2} label="Occupied" value={occupied} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={Home} label="Vacant / Available" value={vacant} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                icon={Wallet}
                label="Annual Rent Roll"
                value={rentRoll}
                format={formatCompactNaira}
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {isLoading && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeletonCard key={i} lines={4} />
          ))}
        </div>
      )}

      {!isLoading && properties?.length === 0 && (
        <div className="mt-6">
          <EmptyState message="No properties assigned yet." />
        </div>
      )}

      {!isLoading && currentProperties.length > 0 && (
        <div className="mt-6 max-w-sm">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search properties by name or location"
          />
        </div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredProperties.map((property) => (
          <motion.div key={property.id} variants={fadeUp}>
            <PropertyCard
              property={property}
              isOccupied={occupiedPropertyIds.has(property.id)}
              onClick={() => navigate(`/agent/properties/${property.id}`)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
