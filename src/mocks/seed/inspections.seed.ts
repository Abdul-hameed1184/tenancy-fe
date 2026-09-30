import type { Inspection } from "@/types/entities";

function daysFromNow(days: number, hour = 14, minute = 30) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const inspections: Inspection[] = [
  {
    id: "insp-1",
    propertyId: "prop-1",
    tenantId: "tenant-1",
    agentId: "agent-1",
    prospectName: "Chioma Uzor",
    requestedAt: daysFromNow(-3),
    scheduledAt: daysFromNow(0),
    status: "confirmed",
  },
  {
    id: "insp-2",
    propertyId: "prop-5",
    tenantId: "tenant-1",
    agentId: "agent-1",
    prospectName: "Yusuf Bello",
    requestedAt: daysFromNow(-2),
    scheduledAt: daysFromNow(1),
    status: "confirmed",
  },
  {
    id: "insp-3",
    propertyId: "prop-6",
    tenantId: "tenant-1",
    agentId: "agent-1",
    prospectName: "Grace Effiong",
    requestedAt: daysFromNow(-1),
    scheduledAt: daysFromNow(2),
    status: "requested",
  },
  {
    id: "insp-4",
    propertyId: "prop-2",
    tenantId: "tenant-1",
    agentId: "agent-2",
    prospectName: "Kunle Adebisi",
    requestedAt: daysFromNow(-10),
    scheduledAt: daysFromNow(-4),
    status: "completed",
  },
  {
    id: "insp-5",
    propertyId: "prop-9",
    tenantId: "tenant-1",
    agentId: "agent-2",
    prospectName: "Ifeoma Nnamdi",
    requestedAt: daysFromNow(-6),
    scheduledAt: daysFromNow(-1),
    status: "cancelled",
  },
  {
    id: "insp-6",
    propertyId: "prop-12",
    tenantId: "tenant-1",
    agentId: "agent-3",
    prospectName: "Obinna Chukwu",
    requestedAt: daysFromNow(-1),
    scheduledAt: daysFromNow(3),
    status: "requested",
  },
  {
    id: "insp-7",
    propertyId: "prop-10",
    tenantId: "tenant-1",
    agentId: "agent-3",
    prospectName: "Blessing Etim",
    requestedAt: daysFromNow(-2),
    scheduledAt: daysFromNow(0),
    status: "confirmed",
  },
];
