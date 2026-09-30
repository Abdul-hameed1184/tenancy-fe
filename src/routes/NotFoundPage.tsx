import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-950 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-400">404</p>
      <h1 className="text-display-sm text-white sm:text-display-md">Page not found</h1>
      <p className="max-w-sm text-navy-400">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Button asChild>
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
}
