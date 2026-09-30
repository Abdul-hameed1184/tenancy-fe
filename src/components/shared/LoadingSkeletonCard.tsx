import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <Card className="p-5">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full max-w-[80%]" />
        ))}
      </div>
    </Card>
  );
}
