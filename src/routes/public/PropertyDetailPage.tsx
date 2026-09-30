import { motion } from "framer-motion";
import {
  BedDouble,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Heart,
  MapPin,
  MessageSquare,
  Maximize2,
  Ruler,
  Share2,
  ShowerHead,
  Star,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useProperty } from "@/features/properties/hooks/useProperty";
import { useAgent } from "@/features/agents/hooks/useAgent";
import { formatNaira } from "@/lib/utils";

const FILLER_PHOTOS = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1762811054947-605b20298615?q=80&w=800&auto=format&fit=crop",
];

const AMENITIES = [
  "Waterfront View",
  "Smart Home",
  "Gym & Pool",
  "24/7 Power",
  "Elevator",
  "CCTV Security",
];

const SAFE_RENTING_TIPS = [
  "Always inspect the property in person before logging any manual payments.",
  "Ensure you are communicating with a PLEET-verified agent.",
];

function hashSeed(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  return hash;
}

function propertyType(title: string) {
  if (/villa/i.test(title)) return "Villa";
  if (/penthouse/i.test(title)) return "Penthouse";
  if (/court|residence|flat|suites?/i.test(title)) return "Apartment";
  return "Residence";
}

function agentExperienceYears(createdAt: string) {
  const years = (Date.now() - new Date(createdAt).getTime()) / (365 * 24 * 60 * 60 * 1000);
  return Math.max(1, Math.floor(years));
}

export default function PropertyDetailPage() {
  const { propertyId } = useParams();
  const { data: property, isLoading, isError } = useProperty(propertyId);
  const { data: agent } = useAgent(property?.agentId ?? undefined);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <LoadingSkeletonCard lines={6} />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState message="This listing isn't available anymore." />
      </div>
    );
  }

  const seed = hashSeed(property.id);
  const rating = (4.6 + (seed % 4) / 10).toFixed(1);
  const reviewCount = 12 + (seed % 40);
  const gallery = [property.photos[0], ...FILLER_PHOTOS];
  const specs = [
    { icon: BedDouble, label: "Bedrooms", value: String(property.bedrooms) },
    { icon: ShowerHead, label: "Bathrooms", value: String(property.bathrooms) },
    { icon: Ruler, label: "Total Area", value: `${property.sqft.toLocaleString()} sqft` },
    { icon: Building2, label: "Type", value: propertyType(property.title) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="success">Premium Listing</Badge>
              <Badge variant="neutral" className="uppercase">
                {property.neighborhood} &bull; {property.city}
              </Badge>
            </div>
            <h1 className="mt-3 text-display-sm text-white sm:text-display-md">{property.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-navy-300">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-brand-400" />
                {property.neighborhood}, {property.city}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {rating} ({reviewCount} Reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-brand-400 sm:text-3xl">
              {formatNaira(property.priceAnnual)}
              <span className="text-sm font-normal text-navy-400">/yr</span>
            </p>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-navy-700 text-navy-300 transition-colors hover:border-navy-600 hover:text-white"
              aria-label="Save listing"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-navy-700 text-navy-300 transition-colors hover:border-navy-600 hover:text-white"
              aria-label="Share listing"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-xl lg:col-span-2">
            <img
              src={gallery[0]}
              alt={property.title}
              className="h-72 w-full object-cover sm:h-[26rem]"
            />
            <a
              href={gallery[0]}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-navy-950/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-navy-900"
            >
              <Maximize2 className="h-3.5 w-3.5" /> View Fullscreen
            </a>
            <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden gap-2 sm:flex">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex-1 rounded-lg border border-white/10 bg-navy-950/70 px-3 py-2 text-center backdrop-blur-sm"
                >
                  <s.icon className="mx-auto h-4 w-4 text-brand-400" />
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-navy-300">{s.label}</p>
                  <p className="text-sm font-semibold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {gallery.slice(1).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-32 w-full rounded-xl object-cover sm:h-[12.5rem]"
              />
            ))}
          </div>
        </div>

        {/* Mobile spec chips */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
          {specs.map((s) => (
            <div key={s.label} className="rounded-lg border border-navy-700/60 bg-navy-850 px-3 py-2 text-center">
              <s.icon className="mx-auto h-4 w-4 text-brand-400" />
              <p className="mt-1 text-[10px] uppercase tracking-wide text-navy-400">{s.label}</p>
              <p className="text-sm font-semibold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white">About Property</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-300">
              A breathtaking {propertyType(property.title).toLowerCase()} in the heart of{" "}
              {property.neighborhood}. Features floor-to-ceiling windows, smart home integration,
              and exclusive access to premium estate amenities. Designed for those who appreciate
              architectural excellence and security — every payment and maintenance request for
              this residence is tracked on PLEET's managed ledger.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {AMENITIES.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-navy-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />
                  {a}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {agent && (
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                    <AvatarFallback>{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-white">{agent.name}</p>
                    <p className="text-xs text-navy-400">Licensed Elite Agent</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 border-t border-navy-700/60 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-navy-400">Experience</span>
                    <span className="text-brand-400">{agentExperienceYears(agent.createdAt)} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-400">Properties</span>
                    <span className="text-white">{agent.assetsManagedCount} Listings</span>
                  </div>
                </div>
                <Button className="mt-4 w-full" asChild>
                  <Link to={`/auth/login?returnTo=/rentals/${property.id}`}>
                    <MessageSquare className="h-4 w-4" /> Message Agent
                  </Link>
                </Button>
                <Button variant="secondary" className="mt-2 w-full" asChild>
                  <Link to={`/auth/login?returnTo=/rentals/${property.id}`}>
                    <CalendarCheck className="h-4 w-4" /> Schedule Inspection
                  </Link>
                </Button>
                <p className="mt-3 text-center text-[11px] text-navy-500">
                  Property ID: PLEET-{property.id.replace(/\D/g, "").padStart(5, "0")}
                </p>
              </Card>
            )}

            <Card className="p-5">
              <p className="text-sm font-semibold text-white">Safe Renting Tips</p>
              <div className="mt-3 space-y-2">
                {SAFE_RENTING_TIPS.map((tip) => (
                  <div key={tip} className="flex items-start gap-2 text-xs text-navy-300">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" />
                    {tip}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
