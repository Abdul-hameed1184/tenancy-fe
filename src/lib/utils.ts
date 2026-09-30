import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatNaira(amount: number) {
  return nairaFormatter.format(amount);
}

export function formatCompactNaira(amount: number) {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return formatNaira(amount);
}

export function formatRelativeTime(isoDate: string) {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const diffMins = Math.round(diffMs / 60_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.round(diffDays / 30);
  return `${diffMonths}mo ago`;
}

export function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-NG", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function daysUntil(isoDate: string) {
  const target = new Date(isoDate).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}
