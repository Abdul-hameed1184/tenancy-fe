import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { title: "Portfolio dashboards", description: "Track occupancy, revenue and agent performance in one view." },
  { title: "Append-only payment ledger", description: "Every payment logged by your agent, never overwritten." },
  { title: "Maintenance & inspections", description: "Coordinate tenant requests and prospective viewings end to end." },
];

export default function ManagementInfoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
          <Building2 className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-display-sm text-white sm:text-display-md">
          Architectural Management Tools
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-navy-300">
          Give your landlords a read-only, always-current view of every asset they own — without
          handing over the keys to manage it.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="p-5">
            <p className="text-sm font-semibold text-white">{f.title}</p>
            <p className="mt-1 text-sm text-navy-400">{f.description}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button size="lg" asChild>
          <Link to="/auth/register">List Your Property</Link>
        </Button>
      </div>
    </div>
  );
}
