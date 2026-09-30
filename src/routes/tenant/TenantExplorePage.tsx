import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { useSession } from "@/features/auth/hooks/useSession";
import { useProperties } from "@/features/properties/hooks/useProperties";
import { useRequestInspection } from "@/features/inspections/hooks/useRequestInspection";
import type { Property } from "@/types/entities";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function TenantExplorePage() {
  const user = useSession();
  const { data: properties, isLoading } = useProperties({ status: "listed" });
  const [selected, setSelected] = useState<Property | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const requestInspection = useRequestInspection();

  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Explore</h1>
      <p className="mt-1 text-navy-300">Available PLEET-managed residences you can request to view.</p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {isLoading && Array.from({ length: 6 }).map((_, i) => <LoadingSkeletonCard key={i} lines={4} />)}
        {properties?.map((property) => (
          <motion.div key={property.id} variants={fadeUp}>
            <Card className="overflow-hidden">
              <PropertyCard property={property} />
              <div className="p-4 pt-0">
                <Dialog
                  open={selected?.id === property.id}
                  onOpenChange={(open) => setSelected(open ? property : null)}
                >
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Request Inspection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request an inspection</DialogTitle>
                    </DialogHeader>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!user || !selected) return;
                        const agentId = selected.agentId;
                        if (!agentId) return;
                        requestInspection.mutate(
                          {
                            propertyId: selected.id,
                            tenantId: user.id,
                            agentId,
                            prospectName: user.name,
                            scheduledAt: new Date(scheduledAt).toISOString(),
                          },
                          { onSuccess: () => setSelected(null) },
                        );
                      }}
                    >
                      <div className="space-y-1.5">
                        <Label htmlFor="scheduledAt">Preferred date &amp; time</Label>
                        <Input
                          id="scheduledAt"
                          type="datetime-local"
                          required
                          value={scheduledAt}
                          onChange={(e) => setScheduledAt(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={requestInspection.isPending}>
                          {requestInspection.isPending ? "Requesting..." : "Request"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
