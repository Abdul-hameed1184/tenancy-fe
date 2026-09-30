import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useReport } from "@/features/reports/hooks/useReport";
import { formatDate } from "@/lib/utils";

export default function LandlordReportDetailPage() {
  const { reportId } = useParams();
  const { data: report, isLoading } = useReport(reportId);

  if (isLoading || !report) {
    return <LoadingSkeletonCard lines={4} />;
  }

  return (
    <div>
      <Link to="/landlord/reports" className="flex items-center gap-1 text-sm text-navy-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to reports
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white capitalize">{report.type} Report</h1>
          <p className="mt-1 text-navy-300">Filed {formatDate(report.createdAt)}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <Card className="mt-6 max-w-2xl p-5">
        <SectionHeader title="Details" />
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-navy-400">Target</dt>
            <dd className="text-white">{report.targetId}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-navy-400">Reason</dt>
            <dd className="text-right text-white">{report.reason}</dd>
          </div>
        </dl>
        {report.status === "open" && (
          <p className="mt-5 text-sm text-navy-400">
            The PLEET admin team is reviewing this report — you'll be notified once it's resolved.
          </p>
        )}
      </Card>
    </div>
  );
}
