import { motion } from "framer-motion";
import { CountUpNumber } from "@/components/shared/CountUpNumber";
import { fadeUp, stagger } from "./motionVariants";

const stats = [
  { value: 240, suffix: "+", label: "Properties Managed" },
  { value: 60, suffix: "+", label: "Verified Agents" },
  { value: 3, suffix: "", label: "Cities Covered" },
  { value: 98, suffix: "%", label: "Rent Collection Rate" },
];

export function TrustStatsSection() {
  return (
    <section className="border-t border-navy-700/60 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <p className="text-display-md text-white">
                <CountUpNumber value={stat.value} format={(v) => `${v}${stat.suffix}`} />
              </p>
              <p className="mt-1 text-sm text-navy-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
