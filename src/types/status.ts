export type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral";

export const PRIORITY_LABELS: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const MAINTENANCE_STATUS_LABELS: Record<string, string> = {
  reported: "Reported",
  in_progress: "In Progress",
  completed: "Completed",
};

export const INSPECTION_STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid: "Verified",
  due: "Due",
  overdue: "Overdue",
};

export const PROPERTY_STATUS_LABELS: Record<string, string> = {
  listed: "For Rent",
  occupied: "Occupied",
  unavailable: "Unavailable",
};

export const VERIFICATION_STATUS_LABELS: Record<string, string> = {
  unverified: "Unverified",
  pending: "Pending Review",
  verified: "Verified",
  rejected: "Rejected",
};

export const REPORT_STATUS_LABELS: Record<string, string> = {
  open: "Open",
  resolved: "Resolved",
};
