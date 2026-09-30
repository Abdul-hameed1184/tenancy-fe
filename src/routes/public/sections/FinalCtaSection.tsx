import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FinalCtaSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glow-accent border-brand-500/30 bg-gradient-to-br from-navy-850 to-navy-900 p-8 text-center sm:p-12">
            <h2 className="text-display-sm text-white sm:text-display-md">
              Ready to elevate your rental experience?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-navy-300 sm:text-base">
              Join verified landlords, agents, and tenants managing every listing, payment, and
              request in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/rentals">
                  Explore Listings <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth/register">List Your Property</Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
