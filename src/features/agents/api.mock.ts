import { withLatency } from "@/lib/api/http";
import { db } from "@/mocks/db";
import type { AgentProfile, VerificationStatus } from "@/types/entities";

export interface AgentFilters {
  verificationStatus?: VerificationStatus;
}

export function getAgents(filters: AgentFilters = {}): Promise<AgentProfile[]> {
  return withLatency(() => {
    let agents = db.users.filter((u): u is AgentProfile => u.role === "agent");
    if (filters.verificationStatus) {
      agents = agents.filter((a) => a.verificationStatus === filters.verificationStatus);
    }
    return agents;
  });
}

export function getAgent(id: string): Promise<AgentProfile> {
  return withLatency(() => {
    const agent = db.users.find((u): u is AgentProfile => u.role === "agent" && u.id === id);
    if (!agent) throw new Error(`Agent ${id} not found`);
    return agent;
  });
}

export function getVerificationQueue(): Promise<AgentProfile[]> {
  return withLatency(() =>
    db.users.filter(
      (u): u is AgentProfile =>
        u.role === "agent" && (u as AgentProfile).verificationStatus === "pending",
    ),
  );
}

export function reviewAgentVerification(
  agentId: string,
  decision: Extract<VerificationStatus, "verified" | "rejected">,
): Promise<AgentProfile> {
  return withLatency(() => {
    const idx = db.users.findIndex((u) => u.id === agentId && u.role === "agent");
    if (idx === -1) throw new Error(`Agent ${agentId} not found`);
    const agent = db.users[idx] as AgentProfile;
    const updated: AgentProfile = {
      ...agent,
      verificationStatus: decision,
      trustScore: decision === "verified" ? Math.max(agent.trustScore, 80) : agent.trustScore,
    };
    db.users[idx] = updated;
    return updated;
  });
}
