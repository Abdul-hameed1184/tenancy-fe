import type { Report } from "@/types/entities";

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const reports: Report[] = [
  {
    id: "report-1",
    type: "listing",
    targetId: "prop-9",
    reason: "Listing photos don't match the unit shown during inspection.",
    reportedById: "tenant-2",
    status: "open",
    createdAt: daysFromNow(-2),
  },
  {
    id: "report-2",
    type: "user",
    targetId: "agent-4",
    reason: "Prospective tenant flagged unresponsive agent after inspection request.",
    reportedById: "tenant-3",
    status: "open",
    createdAt: daysFromNow(-1),
  },
  {
    id: "report-3",
    type: "listing",
    targetId: "prop-12",
    reason: "Duplicate listing found under a different agent.",
    reportedById: "landlord-1",
    status: "resolved",
    createdAt: daysFromNow(-15),
  },
  {
    id: "report-4",
    type: "user",
    targetId: "agent-5",
    reason: "Prospective tenant says agent never followed up after a scheduled inspection.",
    reportedById: "tenant-4",
    status: "open",
    createdAt: daysFromNow(-3),
  },
  {
    id: "report-5",
    type: "listing",
    targetId: "prop-14",
    reason: "Advertised rent doesn't match the amount quoted during the viewing.",
    reportedById: "tenant-6",
    status: "open",
    createdAt: daysFromNow(-5),
  },
  {
    id: "report-6",
    type: "user",
    targetId: "tenant-7",
    reason: "Tenant repeatedly missed scheduled inspection slots without notice.",
    reportedById: "agent-2",
    status: "resolved",
    createdAt: daysFromNow(-20),
  },
  {
    id: "report-7",
    type: "listing",
    targetId: "prop-5",
    reason: "Listing photos appear outdated compared to the property's current condition.",
    reportedById: "landlord-1",
    status: "resolved",
    createdAt: daysFromNow(-25),
  },
];
