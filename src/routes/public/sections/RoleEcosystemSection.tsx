import { motion } from "framer-motion";
import { Home, ShieldCheck, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { fadeUp, stagger } from "./motionVariants";

const roles = [
  {
    icon: Home,
    title: "Landlord",
    description: "List and monitor assets with high-fidelity reports.",
  },
  {
    icon: ShieldCheck,
    title: "Agent",
    description: "Manage tenants and maintenance with verified status.",
  },
  {
    icon: Users,
    title: "Tenant",
    description: "Browse curated luxury and manage your residency.",
  },
];

export function RoleEcosystemSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="border-navy-700/60 p-8 text-center sm:p-12">
          <h2 className="text-display-sm text-white sm:text-display-md">
            Your role in the ecosystem.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-navy-300 sm:text-base">
            Whether you're listing a high-value asset, managing elite rentals, or seeking your
            next home, PLEET provides the tools.
          </p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {roles.map((role) => (
              <motion.div
                key={role.title}
                variants={fadeUp}
                whileHover={{ y: -2 }}
                className="rounded-lg border border-navy-700/60 bg-navy-900/60 p-5 text-left hover:border-brand-400"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-400">
                  <role.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{role.title}</p>
                <p className="mt-1 text-sm text-navy-400">{role.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </div>
    </section>
  );
}
