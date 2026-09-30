import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ListRowProps {
  thumbnail?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  showChevron?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ListRow({
  thumbnail,
  title,
  subtitle,
  trailing,
  showChevron = false,
  onClick,
  className,
}: ListRowProps) {
  const interactive = Boolean(onClick);

  return (
    <motion.div
      onClick={onClick}
      whileHover={interactive ? { y: -1 } : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md p-3 transition-colors",
        interactive && "cursor-pointer hover:bg-navy-800/60",
        className,
      )}
    >
      {thumbnail && <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-navy-800">{thumbnail}</div>}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{title}</p>
        {subtitle && <p className="truncate text-xs text-navy-400">{subtitle}</p>}
      </div>
      {trailing && <div className="flex shrink-0 items-center gap-4">{trailing}</div>}
      {showChevron && <ChevronRight className="h-4 w-4 shrink-0 text-navy-400" />}
    </motion.div>
  );
}
