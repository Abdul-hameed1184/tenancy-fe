import { motion } from "framer-motion";
import { BedDouble, MapPin, Ruler, ShowerHead } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Property } from "@/types/entities";
import { formatCompactNaira } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
      <Card
        onClick={onClick}
        className={`overflow-hidden rounded-lg border border-navy-700/60 ${onClick ? "cursor-pointer" : ""} hover:border-brand-400`}
      >
        <div className="relative h-48 w-full overflow-hidden bg-navy-800">
          <img
            src={property.photos[0]}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <Badge
            variant="info"
            className="absolute left-3 top-3 border-none bg-navy-950/70 text-white backdrop-blur-sm"
          >
            {property.status === "unavailable" ? "Unavailable" : "For Rent"}
          </Badge>
          <FavoriteButton className="absolute right-3 top-3" />
        </div>
        <div className="p-5">
          <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-brand-400">
            <MapPin className="h-3 w-3" />
            {property.neighborhood}, {property.city}
          </p>
          <h3 className="mt-1 truncate text-base font-semibold text-white">{property.title}</h3>
          <div className="mt-3 flex items-center gap-4 text-sm text-navy-300">
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" /> {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <ShowerHead className="h-4 w-4" /> {property.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Ruler className="h-4 w-4" /> {property.sqft.toLocaleString()} sqft
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-navy-700/60 pt-4">
            <p className="text-lg font-bold text-white">
              {formatCompactNaira(property.priceAnnual)}
              <span className="text-sm font-normal text-navy-400">/yr</span>
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
