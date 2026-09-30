import { USE_MOCKS } from "@/lib/api/config";
import * as mock from "./api.mock";
import * as remote from "./api.remote";

export type { PropertyFilters } from "./api.mock";

const api: typeof remote = USE_MOCKS ? mock : remote;

export const {
  getProperties,
  getProperty,
  getFeaturedProperties,
  getTopPerformingProperties,
  assignAgentToProperty,
  unassignAgent,
  updateProperty,
  createProperty,
} = api;
