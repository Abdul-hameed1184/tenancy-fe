import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { useProperties } from "@/features/properties/hooks/useProperties";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function RentalsPage() {
  const { data: properties, isLoading } = useProperties();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-display-sm text-white sm:text-display-md">All Rentals</h1>
      <p className="mt-2 max-w-xl text-navy-300">
        Every PLEET-managed residence, from Banana Island penthouses to Maitama villas.
      </p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {isLoading && Array.from({ length: 6 }).map((_, i) => <LoadingSkeletonCard key={i} lines={4} />)}
        {properties?.map((property) => (
          <motion.div key={property.id} variants={fadeUp}>
            <PropertyCard property={property} onClick={() => navigate(`/rentals/${property.id}`)} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
