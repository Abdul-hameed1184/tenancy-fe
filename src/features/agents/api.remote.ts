import { http } from "@/lib/api/http";
import type { AgentProfile, VerificationStatus } from "@/types/entities";
import type { AgentFilters } from "./api.mock";

export const getAgents = (filters: AgentFilters = {}) =>
  http.get<AgentProfile[]>("/agents", filters);

export const getAgent = (id: string) => http.get<AgentProfile>(`/agents/${id}`);

export const getVerificationQueue = () => http.get<AgentProfile[]>("/admin/verifications");

export const reviewAgentVerification = (
  agentId: string,
  decision: Extract<VerificationStatus, "verified" | "rejected">,
) => http.post<AgentProfile>(`/admin/verifications/${agentId}`, { decision });
