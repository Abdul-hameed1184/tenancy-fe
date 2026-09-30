import { withLatency } from "@/lib/api/http";
import { db, genId } from "@/mocks/db";
import type { Report, ReportStatus, ReportType } from "@/types/entities";

export interface ReportFilters {
  status?: ReportStatus;
  type?: ReportType;
  reportedById?: string;
}

export function getReports(filters: ReportFilters = {}): Promise<Report[]> {
  return withLatency(() => {
    let results = [...db.reports];
    if (filters.status) results = results.filter((r) => r.status === filters.status);
    if (filters.type) results = results.filter((r) => r.type === filters.type);
    if (filters.reportedById) results = results.filter((r) => r.reportedById === filters.reportedById);
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });
}

export function getReport(id: string): Promise<Report> {
  return withLatency(() => {
    const report = db.reports.find((r) => r.id === id);
    if (!report) throw new Error(`Report ${id} not found`);
    return report;
  });
}

export function createReport(
  dto: Pick<Report, "type" | "targetId" | "reason" | "reportedById">,
): Promise<Report> {
  return withLatency(() => {
    const report: Report = {
      ...dto,
      id: genId("report"),
      status: "open",
      createdAt: new Date().toISOString(),
    };
    db.reports.push(report);
    return report;
  });
}

export function resolveReport(id: string): Promise<Report> {
  return withLatency(() => {
    const idx = db.reports.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Report ${id} not found`);
    db.reports[idx] = { ...db.reports[idx], status: "resolved" };
    return db.reports[idx];
  });
}
