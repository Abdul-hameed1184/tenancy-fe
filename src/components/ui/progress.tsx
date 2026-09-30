import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-navy-700", className)}
    {...props}
  >
    <motion.div
      className="h-full rounded-full bg-brand-500"
      initial={{ width: 0 }}
      animate={{ width: `${value ?? 0}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
