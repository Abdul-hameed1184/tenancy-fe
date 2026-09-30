import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TrustScoreCardProps {
  trustScore: number;
  onViewStats?: () => void;
}

export function TrustScoreCard({ trustScore, onViewStats }: TrustScoreCardProps) {
  return (
    <Card className="glow-accent p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-400">
        <ShieldCheck className="h-4 w-4" />
        Verified Elite Agent
      </div>
      <p className="mt-3 text-2xl font-bold text-white">Trust Score: {trustScore}%</p>
      <p className="mt-1 text-sm text-navy-300">
        Your account is in excellent standing. You have access to exclusive landlord property
        assignments.
      </p>
      <Progress value={trustScore} className="mt-4" />
      <Button variant="secondary" className="mt-4 w-full" onClick={onViewStats}>
        View Performance Stats
      </Button>
    </Card>
  );
}
