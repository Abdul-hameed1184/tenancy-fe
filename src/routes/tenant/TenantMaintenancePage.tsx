import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList, Plus, Wrench } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { useMyTenancy } from "@/features/tenants/hooks/useMyTenancy";
import { useMaintenanceRequests } from "@/features/maintenance/hooks/useMaintenanceRequests";
import { useCreateMaintenanceRequest } from "@/features/maintenance/hooks/useCreateMaintenanceRequest";
import type { MaintenancePriority } from "@/types/entities";
import { formatDate } from "@/lib/utils";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function TenantMaintenancePage() {
  const user = useSession();
  const { data: tenancy } = useMyTenancy(user?.id);
  const { data: requests, isLoading } = useMaintenanceRequests({ tenantId: user?.id });
  const createRequest = useCreateMaintenanceRequest();

  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<MaintenancePriority>("medium");

  const total = requests?.length ?? 0;
  const reported = requests?.filter((r) => r.status === "reported").length ?? 0;
  const inProgress = requests?.filter((r) => r.status === "in_progress").length ?? 0;
  const completed = requests?.filter((r) => r.status === "completed").length ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white sm:text-display-md">Maintenance</h1>
          <p className="mt-1 text-navy-300">Track requests for your home.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request maintenance</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!user || !tenancy) return;
                createRequest.mutate(
                  {
                    propertyId: tenancy.propertyId,
                    tenantId: user.id,
                    issueType,
                    description,
                    priority,
                  },
                  {
                    onSuccess: () => {
                      setOpen(false);
                      setIssueType("");
                      setDescription("");
                    },
                  },
                );
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="issueType">Issue type</Label>
                <Input id="issueType" required value={issueType} onChange={(e) => setIssueType(e.target.value)} placeholder="e.g. Plumbing" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail…"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as MaintenancePriority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createRequest.isPending || !tenancy}>
                  {createRequest.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <LoadingSkeletonCard key={i} />)
        ) : (
          <>
            <motion.div variants={fadeUp}>
              <StatCard icon={ClipboardList} label="Total Requests" value={total} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={Wrench} label="New / Reported" value={reported} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CheckCircle2} label="In Progress" value={inProgress} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={CheckCircle2} label="Completed" value={completed} />
            </motion.div>
          </>
        )}
      </motion.div>

      <Card className="mt-6 p-5">
        {isLoading && <p className="text-sm text-navy-400">Loading...</p>}
        {!isLoading && requests?.length === 0 && <EmptyState message="No maintenance requests yet." />}
        <div className="divide-y divide-navy-700/40">
          {requests?.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-white">{r.issueType}</p>
                <p className="text-xs text-navy-400">{r.description}</p>
                <p className="text-xs text-navy-500">{formatDate(r.reportedAt)}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={r.priority} />
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
