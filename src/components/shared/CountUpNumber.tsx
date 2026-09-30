import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface CountUpNumberProps {
  value: number;
  format?: (value: number) => string;
  className?: string;
}

export function CountUpNumber({ value, format, className }: CountUpNumberProps) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    format ? format(Math.round(latest)) : Math.round(latest).toLocaleString(),
  );

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.6, ease: "easeOut" });
    return () => controls.stop();
  }, [value, motionValue]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
