import { USE_MOCKS } from "@/lib/api/config";
import * as mock from "./api.mock";
import * as remote from "./api.remote";

export type { InspectionFilters } from "./api.mock";

const api: typeof remote = USE_MOCKS ? mock : remote;

export const {
  getInspections,
  getInspection,
  requestInspection,
  confirmInspection,
  completeInspection,
  cancelInspection,
} = api;
