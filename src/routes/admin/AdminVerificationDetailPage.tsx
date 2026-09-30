import { ArrowLeft, FileText } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAgent } from "@/features/agents/hooks/useAgent";
import { useReviewAgentVerification } from "@/features/agents/hooks/useReviewAgentVerification";

export default function AdminVerificationDetailPage() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { data: agent, isLoading } = useAgent(agentId);
  const review = useReviewAgentVerification();

  if (isLoading || !agent) {
    return <LoadingSkeletonCard lines={5} />;
  }

  return (
    <div>
      <Link to="/admin/verifications" className="flex items-center gap-1 text-sm text-navy-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to queue
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white">{agent.name}</h1>
          <p className="mt-1 text-navy-300">{agent.agency}</p>
        </div>
        <StatusBadge status={agent.verificationStatus} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <SectionHeader title="Identity Verification" />
            <div className="flex items-center gap-3 rounded-md border border-navy-700/60 bg-navy-900/60 p-4">
              <FileText className="h-6 w-6 text-brand-400" />
              <div>
                <p className="text-sm font-medium text-white">Passport document</p>
                <p className="text-xs text-navy-400">{agent.passportDocUrl}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-md border border-navy-700/60 bg-navy-900/60 p-4">
              <div>
                <p className="text-sm font-medium text-white">Third-party check</p>
                <p className="text-xs text-navy-400">Reference {agent.thirdPartyCheckRef}</p>
              </div>
              <StatusBadge status="success" label="Passed" />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader title="Decision" />
            <div className="space-y-2">
              <Button
                className="w-full"
                disabled={review.isPending}
                onClick={() =>
                  review.mutate(
                    { agentId: agent.id, decision: "verified" },
                    { onSuccess: () => navigate("/admin/verifications") },
                  )
                }
              >
                Approve Agent
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                disabled={review.isPending}
                onClick={() =>
                  review.mutate(
                    { agentId: agent.id, decision: "rejected" },
                    { onSuccess: () => navigate("/admin/verifications") },
                  )
                }
              >
                Reject
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
