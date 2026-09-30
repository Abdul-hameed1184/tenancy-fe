import { motion } from "framer-motion";
import { PieChart } from "lucide-react";

export function ChartPlaceholder() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-navy-700 bg-navy-900/40">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="text-brand-500/60"
      >
        <PieChart className="h-10 w-10" />
      </motion.div>
      <p className="text-sm font-medium text-navy-300">Visual Revenue Breakdown Analytics</p>
      <p className="text-xs uppercase tracking-wide text-navy-500">
        Integrating with real-time logging...
      </p>
    </div>
  );
}
