import { http } from "@/lib/api/http";
import type { Report } from "@/types/entities";
import type { ReportFilters } from "./api.mock";

export const getReports = (filters: ReportFilters = {}) => http.get<Report[]>("/reports", filters);

export const getReport = (id: string) => http.get<Report>(`/reports/${id}`);

export const createReport = (dto: Pick<Report, "type" | "targetId" | "reason" | "reportedById">) =>
  http.post<Report>("/reports", dto);

export const resolveReport = (id: string) => http.post<Report>(`/reports/${id}/resolve`);
