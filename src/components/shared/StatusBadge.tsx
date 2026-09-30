import { Badge } from "@/components/ui/badge";
import { STATUS_VARIANT_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant = STATUS_VARIANT_MAP[status] ?? "neutral";
  const text = label ?? status.replace(/_/g, " ");
  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      {text}
    </Badge>
  );
}
