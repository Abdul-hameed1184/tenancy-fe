import { motion } from "framer-motion";
import { FileWarning, UserCheck } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { useVerificationQueue } from "@/features/agents/hooks/useVerificationQueue";
import { useReports } from "@/features/reports/hooks/useReports";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function AdminOverviewPage() {
  const { data: queue, isLoading: queueLoading } = useVerificationQueue();
  const { data: openReports, isLoading: reportsLoading } = useReports({ status: "open" });

  const loading = queueLoading || reportsLoading;

  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Admin Overview</h1>
      <p className="mt-1 text-navy-300">Agent verification and platform reports at a glance.</p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <LoadingSkeletonCard key={i} />)
        ) : (
          <>
            <motion.div variants={fadeUp}>
              <StatCard icon={UserCheck} label="Pending Verifications" value={queue?.length ?? 0} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard icon={FileWarning} label="Open Reports" value={openReports?.length ?? 0} />
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
