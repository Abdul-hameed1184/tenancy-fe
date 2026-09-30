import { http } from "@/lib/api/http";
import type { Property, PropertyAgentAssignment, PropertyStatus } from "@/types/entities";
import type { PropertyFilters } from "./api.mock";

export const getProperties = (filters: PropertyFilters = {}) =>
  http.get<Property[]>("/properties", filters);

export const getProperty = (id: string) => http.get<Property>(`/properties/${id}`);

export const getFeaturedProperties = () => http.get<Property[]>("/properties", { featured: true });

export const getTopPerformingProperties = (agentId: string, limit = 3) =>
  http.get<Property[]>(`/agents/${agentId}/properties/top`, { limit });

export const assignAgentToProperty = (propertyId: string, agentId: string) =>
  http.put<PropertyAgentAssignment>(`/properties/${propertyId}/agent`, { agentId });

export const unassignAgent = (propertyId: string) =>
  http.delete<void>(`/properties/${propertyId}/agent`);

export const updateProperty = (id: string, patch: Partial<Property>) =>
  http.patch<Property>(`/properties/${id}`, patch);

export const createProperty = (
  dto: Omit<Property, "id" | "occupancyRate" | "status" | "agentId"> & { status?: PropertyStatus },
) => http.post<Property>("/properties", dto);
