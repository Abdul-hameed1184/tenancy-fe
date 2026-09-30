import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactNaira } from "@/lib/utils";
import type { MonthlyRevenuePoint } from "@/features/payments/utils";

export function RevenueChart({ data }: { data: MonthlyRevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-brand-500)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-brand-500)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-navy-700)" vertical={false} />
        <XAxis dataKey="label" stroke="var(--color-navy-400)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="var(--color-navy-400)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompactNaira(v)}
          width={56}
        />
        <Tooltip
          formatter={(value) => formatCompactNaira(Number(value))}
          contentStyle={{
            background: "var(--color-navy-850)",
            border: "1px solid var(--color-navy-700)",
            borderRadius: 8,
            color: "white",
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-brand-500)"
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
