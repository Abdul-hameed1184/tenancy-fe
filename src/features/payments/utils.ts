import type { TenancyDetail } from "@/features/tenants/types";

export interface MonthlyRevenuePoint {
  label: string;
  value: number;
}

export interface PaymentsSummary {
  totalRevenue: number;
  outstanding: number;
  collectionRatePct: number;
  overdueCount: number;
  monthlySeries: MonthlyRevenuePoint[];
}

const MONTHS_TO_SHOW = 6;

export function summarizeTenancyPayments(tenancies: TenancyDetail[]): PaymentsSummary {
  const entries = tenancies.flatMap((t) => t.paymentHistory);

  const totalRevenue = entries.filter((e) => e.status === "paid").reduce((sum, e) => sum + e.amount, 0);
  const outstanding = entries
    .filter((e) => e.status === "due" || e.status === "overdue")
    .reduce((sum, e) => sum + e.amount, 0);
  const overdueCount = entries.filter((e) => e.status === "overdue").length;
  const collectionRatePct =
    totalRevenue + outstanding === 0 ? 100 : Math.round((totalRevenue / (totalRevenue + outstanding)) * 100);

  const now = new Date();
  const buckets: MonthlyRevenuePoint[] = Array.from({ length: MONTHS_TO_SHOW }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS_TO_SHOW - 1 - i), 1);
    return { label: d.toLocaleDateString("en-NG", { month: "short" }), value: 0 };
  });

  for (const entry of entries) {
    if (entry.status !== "paid" || !entry.paidDate) continue;
    const paid = new Date(entry.paidDate);
    const monthsAgo =
      (now.getFullYear() - paid.getFullYear()) * 12 + (now.getMonth() - paid.getMonth());
    const bucketIndex = MONTHS_TO_SHOW - 1 - monthsAgo;
    if (bucketIndex >= 0 && bucketIndex < MONTHS_TO_SHOW) {
      buckets[bucketIndex].value += entry.amount;
    }
  }

  return { totalRevenue, outstanding, collectionRatePct, overdueCount, monthlySeries: buckets };
}
