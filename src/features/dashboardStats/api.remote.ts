import { http } from "@/lib/api/http";
import type { AgentStats, LandlordStats } from "./types";

export const getAgentStats = (agentId: string) => http.get<AgentStats>(`/agents/${agentId}/stats`);

export const getLandlordStats = (landlordId: string) =>
  http.get<LandlordStats>(`/landlords/${landlordId}/stats`);
