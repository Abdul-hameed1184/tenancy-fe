import type { PropertyAgentAssignment } from "@/types/entities";

const assigned = (
  id: string,
  propertyId: string,
  agentId: string,
  assignedAt: string,
): PropertyAgentAssignment => ({ id, propertyId, agentId, assignedAt, active: true });

export const agentAssignments: PropertyAgentAssignment[] = [
  assigned("assign-1", "prop-1", "agent-1", "2023-02-01T09:00:00.000Z"),
  assigned("assign-3", "prop-3", "agent-1", "2023-05-10T09:00:00.000Z"),
  assigned("assign-4", "prop-4", "agent-1", "2023-08-22T09:00:00.000Z"),
  assigned("assign-5", "prop-5", "agent-1", "2024-01-14T09:00:00.000Z"),
  assigned("assign-6", "prop-6", "agent-1", "2024-03-02T09:00:00.000Z"),

  assigned("assign-2", "prop-2", "agent-2", "2023-03-18T09:00:00.000Z"),
  assigned("assign-7", "prop-7", "agent-2", "2023-06-30T09:00:00.000Z"),
  assigned("assign-8", "prop-8", "agent-2", "2023-11-05T09:00:00.000Z"),
  assigned("assign-9", "prop-9", "agent-2", "2024-02-19T09:00:00.000Z"),

  assigned("assign-10", "prop-10", "agent-3", "2023-07-11T09:00:00.000Z"),
  assigned("assign-11", "prop-11", "agent-3", "2023-09-28T09:00:00.000Z"),
  assigned("assign-12", "prop-12", "agent-3", "2024-04-03T09:00:00.000Z"),

  assigned("assign-16", "prop-16", "agent-1", "2025-06-10T09:00:00.000Z"),
  assigned("assign-14", "prop-14", "agent-2", "2025-05-22T09:00:00.000Z"),
  assigned("assign-15", "prop-15", "agent-3", "2025-07-01T09:00:00.000Z"),
];
