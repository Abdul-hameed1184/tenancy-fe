import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useProperties } from "@/features/properties/hooks/useProperties";
import { fadeUp, stagger } from "./motionVariants";

export function EliteListingsSection() {
  const { data: allProperties, isLoading: listingsLoading } = useProperties();
  const navigate = useNavigate();

  const featured = allProperties?.filter((p) => p.featured);
  const listings = (featured && featured.length > 0 ? featured : allProperties)?.slice(0, 3);

  return (
    <section className="border-t border-navy-700/60 bg-navy-900/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Elite Listings"
          description="Curated residences in Lagos and Abuja's most prestigious neighborhoods."
          action={
            <Link
              to="/rentals"
              className="flex items-center gap-1 text-sm font-medium text-brand-400 hover:text-brand-300"
            >
              View All Properties <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {listingsLoading &&
            Array.from({ length: 3 }).map((_, i) => <LoadingSkeletonCard key={i} lines={4} />)}
          {listings?.map((property) => (
            <motion.div key={property.id} variants={fadeUp}>
              <PropertyCard property={property} onClick={() => navigate(`/rentals/${property.id}`)} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
