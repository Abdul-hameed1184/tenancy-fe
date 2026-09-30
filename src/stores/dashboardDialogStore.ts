import { create } from "zustand";

export type DashboardDialogId = "create-property" | "assign-agent" | "file-report";

export interface AssignAgentDialogContext {
  propertyId?: string;
  agentId?: string;
}

interface DashboardDialogState {
  openDialogId: DashboardDialogId | null;
  assignAgentContext: AssignAgentDialogContext | null;
  openDialog: (id: DashboardDialogId, context?: AssignAgentDialogContext) => void;
  closeDialog: () => void;
}

/**
 * Dialogs are mounted once per dashboard layout (not per trigger), so any
 * button anywhere in the dashboard can open one without owning a Dialog
 * instance itself — this store is the single source of truth for which
 * dialog is open and what record it's acting on.
 */
export const useDashboardDialogStore = create<DashboardDialogState>((set) => ({
  openDialogId: null,
  assignAgentContext: null,
  openDialog: (id, context) => set({ openDialogId: id, assignAgentContext: context ?? null }),
  closeDialog: () => set({ openDialogId: null, assignAgentContext: null }),
}));
