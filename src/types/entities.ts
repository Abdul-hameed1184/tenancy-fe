export type Role = "admin" | "landlord" | "agent" | "tenant";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export interface AgentProfile extends User {
  role: "agent";
  agency: string;
  verificationStatus: VerificationStatus;
  trustScore: number;
  passportDocUrl?: string;
  thirdPartyCheckRef?: string;
  assetsManagedCount: number;
}

export type PropertyStatus = "listed" | "occupied" | "unavailable";

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  photos: string[];
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  priceAnnual: number;
  status: PropertyStatus;
  landlordId: string;
  occupancyRate: number;
  featured?: boolean;
  /** Currently assigned (active) managing agent, or null. Computed server-side. */
  agentId?: string | null;
}

export interface PropertyAgentAssignment {
  id: string;
  propertyId: string;
  agentId: string;
  assignedAt: string;
  active: boolean;
}

export type PaymentStatus = "paid" | "due" | "overdue";

export interface PaymentEntry {
  id: string;
  tenancyId: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  method: "bank_transfer" | "card" | "cash" | "cheque";
  loggedByAgentId: string;
  loggedAt: string;
  status: PaymentStatus;
  note?: string;
}

export interface TenantPropertyRecord {
  id: string;
  tenantId: string;
  propertyId: string;
  unit: string;
  leaseStart: string;
  nextDueDate: string;
  paymentHistory: PaymentEntry[];
}

export type MaintenancePriority = "high" | "medium" | "low";
export type MaintenanceStatus = "reported" | "in_progress" | "completed";

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  issueType: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  reportedAt: string;
}

export type InspectionStatus = "requested" | "confirmed" | "completed" | "cancelled";

export interface Inspection {
  id: string;
  propertyId: string;
  tenantId: string;
  agentId: string;
  prospectName: string;
  requestedAt: string;
  scheduledAt: string;
  status: InspectionStatus;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  sentAt: string;
  readAt?: string;
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  propertyId?: string;
  lastMessageAt: string;
}

export type ReportType = "listing" | "user";
export type ReportStatus = "open" | "resolved";

export interface Report {
  id: string;
  type: ReportType;
  targetId: string;
  reason: string;
  reportedById: string;
  status: ReportStatus;
  createdAt: string;
}
