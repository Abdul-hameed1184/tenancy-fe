import type {
  AgentProfile,
  Inspection,
  MaintenanceRequest,
  Message,
  MessageThread,
  Property,
  PropertyAgentAssignment,
  Report,
  TenantPropertyRecord,
  User,
} from "@/types/entities";
import type { TenantChangeRequest } from "@/features/tenants/tenantRequests";
import { agentAssignments as agentAssignmentsSeed } from "./seed/agentAssignments.seed";
import { inspections as inspectionsSeed } from "./seed/inspections.seed";
import { maintenanceRequests as maintenanceSeed } from "./seed/maintenance.seed";
import {
  messages as messagesSeed,
  messageThreads as messageThreadsSeed,
} from "./seed/messages.seed";
import { properties as propertiesSeed } from "./seed/properties.seed";
import { reports as reportsSeed } from "./seed/reports.seed";
import { tenancies as tenanciesSeed } from "./seed/tenancies.seed";
import { allUsers } from "./seed/users.seed";

interface Db {
  users: User[];
  properties: Property[];
  agentAssignments: PropertyAgentAssignment[];
  tenancies: TenantPropertyRecord[];
  tenantRequests: TenantChangeRequest[];
  notifications: {
    id: string;
    recipientId: string;
    type: string;
    title: string;
    message: string;
    data: Record<string, unknown>;
    isRead: boolean;
    createdAt: string;
  }[];
  maintenanceRequests: MaintenanceRequest[];
  inspections: Inspection[];
  messageThreads: MessageThread[];
  messages: Message[];
  reports: Report[];
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function createDb(): Db {
  return {
    users: clone(allUsers),
    properties: clone(propertiesSeed),
    agentAssignments: clone(agentAssignmentsSeed),
    tenancies: clone(tenanciesSeed),
    tenantRequests: [],
    notifications: [],
    maintenanceRequests: clone(maintenanceSeed),
    inspections: clone(inspectionsSeed),
    messageThreads: clone(messageThreadsSeed),
    messages: clone(messagesSeed),
    reports: clone(reportsSeed),
  };
}

export let db: Db = createDb();

export function resetDb() {
  db = createDb();
}

export function getAgentProfiles(): AgentProfile[] {
  return db.users.filter((u): u is AgentProfile => u.role === "agent");
}

export function genId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
