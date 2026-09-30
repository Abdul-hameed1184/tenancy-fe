import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AgentsInfoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
        <ShieldCheck className="h-7 w-7" />
      </div>
      <h1 className="mt-6 text-display-sm text-white sm:text-display-md">Verified Agent Network</h1>
      <p className="mt-3 text-navy-300">
        Every PLEET agent passes a passport and third-party verification check before they can list
        or manage a property. Join the network and get access to exclusive high-value assignments.
      </p>
      <Card className="mt-8 p-6 text-left">
        <ul className="space-y-3 text-sm text-navy-300">
          <li>&bull; Passport identity verification with a trusted third-party check</li>
          <li>&bull; Trust scoring based on collection rate and tenant satisfaction</li>
          <li>&bull; Direct assignment to landlord portfolios once verified</li>
        </ul>
      </Card>
      <Button size="lg" className="mt-8" asChild>
        <Link to="/auth/register">Apply as an Agent</Link>
      </Button>
    </div>
  );
}
