import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FavoriteButton({ className }: { className?: string }) {
  const [active, setActive] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setActive((v) => !v);
      }}
      whileTap={{ scale: 0.85 }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-navy-950/60 backdrop-blur-sm transition-colors",
        className,
      )}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("h-4 w-4", active ? "fill-brand-500 text-brand-500" : "text-white")} />
    </motion.button>
  );
}
