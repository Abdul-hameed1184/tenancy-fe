import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "./motionVariants";
import HeroVisuals from "./HeroVisuals";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp}>
            <Badge variant="success" className="mb-5">
              Premium Real Estate Management
            </Badge>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-display-lg text-white sm:text-display-xl">
            Elevating the <span className="text-brand-400">Nigerian Rental</span> Experience.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-lg text-base text-navy-300">
            A high-end platform connecting elite landlords, verified agents, and prestigious
            tenants. Manage listings, maintenance, and logistics with architectural precision.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/rentals">
                Explore Listings <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth/register">List Your Property</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-xl "
          >
           <HeroVisuals />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
