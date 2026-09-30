import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { daysUntil } from "@/lib/utils";
import { getTenancies } from "@/features/tenants/api";
import type { TenancyDetail } from "@/features/tenants/types";

export type DueBucket = "overdue" | "due-30" | "due-60" | "due-90" | "not-due";

export function getDueBucket(nextDueDate: string): DueBucket {
  const days = daysUntil(nextDueDate);
  if (days < 0) return "overdue";
  if (days <= 30) return "due-30";
  if (days <= 60) return "due-60";
  if (days <= 90) return "due-90";
  return "not-due";
}

export interface DueReminder {
  tenancy: TenancyDetail;
  daysUntilDue: number;
  bucket: DueBucket;
}

/** Derived client-side from `nextDueDate` — no separate mock endpoint needed. */
export function useRentDueReminders(agentId: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.tenants.list(), { agentId }],
    queryFn: () => getTenancies({ agentId }),
    enabled: Boolean(agentId),
    select: (tenancies): DueReminder[] =>
      tenancies
        .map((tenancy) => ({
          tenancy,
          daysUntilDue: daysUntil(tenancy.nextDueDate),
          bucket: getDueBucket(tenancy.nextDueDate),
        }))
        .filter((r) => r.bucket !== "not-due")
        .sort((a, b) => a.daysUntilDue - b.daysUntilDue),
  });
}
