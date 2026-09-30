import { motion } from "framer-motion";
import { Handshake, Search, UserCheck, Wallet } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { fadeUp, stagger } from "./motionVariants";

const steps = [
  {
    icon: UserCheck,
    title: "Register & Verify",
    description: "Landlords, agents, and tenants sign up and pass identity verification.",
  },
  {
    icon: Search,
    title: "List or Browse",
    description: "Agents list verified properties; tenants explore curated listings.",
  },
  {
    icon: Handshake,
    title: "Manage With Your Agent",
    description: "Inspections, maintenance, and messaging flow through one dashboard.",
  },
  {
    icon: Wallet,
    title: "Get Paid, Move In",
    description: "Payments are logged to a running ledger every landlord can verify.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="How PLEET works"
          description="From verification to move-in, every step is tracked in one place."
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              whileHover={{ y: -2 }}
              className="relative rounded-lg border border-navy-700/60 bg-navy-850 p-5 hover:border-brand-400"
            >
              <span className="absolute right-4 top-4 text-2xl font-extrabold text-navy-700">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-400">
                <step.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">{step.title}</p>
              <p className="mt-1 text-sm text-navy-400">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
