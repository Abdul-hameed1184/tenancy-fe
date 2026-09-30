import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CountUpNumber } from "./CountUpNumber";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  format?: (value: number) => string;
  badge?: ReactNode;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, format, badge, className }: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Card className={cn("p-5 transition-colors hover:border-navy-600", className)}>
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-400">
            <Icon className="h-5 w-5" />
          </div>
          {badge}
        </div>
        <p className="mt-4 text-sm text-navy-300">{label}</p>
        <CountUpNumber value={value} format={format} className="text-2xl font-bold text-white" />
      </Card>
    </motion.div>
  );
}
