import { motion } from "framer-motion";
import { Building2, CheckCircle2, Home, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { useSession } from "@/features/auth/hooks/useSession";
import { useProperties } from "@/features/properties/hooks/useProperties";
import { formatCompactNaira } from "@/lib/utils";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function AgentPropertiesPage() {
  const user = useSession();
  const navigate = useNavigate();
  const { data: properties, isLoading } = useProperties({ agentId: user?.id });

  const total = properties?.length ?? 0;
  const occupied = properties?.filter((p) => p.status === "occupied").length ?? 0;
  const vacant = properties?.filter((p) => p.status === "listed").length ?? 0;
  const portfolioValue = properties?.reduce((sum, p) => sum + p.priceAnnual, 0) ?? 0;

  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">My Properties</h1>
      <p className="mt-1 text-navy-300">Every property currently assigned to you.</p>

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
              <StatCard icon={Wallet} label="Annual Rent Managed" value={portfolioValue} format={formatCompactNaira} />
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

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {properties?.map((property) => (
          <motion.div key={property.id} variants={fadeUp}>
            <PropertyCard
              property={property}
              onClick={() => navigate(`/agent/properties/${property.id}`)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
