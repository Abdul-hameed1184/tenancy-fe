import { useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "@/features/auth/hooks/useEmailVerification";
import { useSession } from "@/features/auth/hooks/useSession";
import { ROLE_HOME_ROUTE } from "@/lib/constants";

/** Landing page for the emailed link: /auth/verify-email?token=... */
export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const user = useSession();
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useVerifyEmail();
  const started = useRef(false);

  useEffect(() => {
    // StrictMode runs effects twice in development; verify once (the API is idempotent anyway).
    if (started.current || !token) return;
    started.current = true;
    mutate(token);
  }, [mutate, token]);

  if (!token || isError) {
    return (
      <div className="text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Link not valid</h1>
        <p className="mt-2 text-sm text-slate-500">
          {error?.message ?? "This verification link is invalid or has expired."}
        </p>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link to="/auth/verify-email-sent">Send me a new link</Link>
        </Button>
      </div>
    );
  }

  if (isPending || !isSuccess) {
    return (
      <div className="text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-500" />
        <p className="mt-4 text-sm text-slate-500">Verifying your email address…</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Email verified</h1>
      <p className="mt-2 text-sm text-slate-500">Your PLEET account is ready to use.</p>
      {user ? (
        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={() => navigate(ROLE_HOME_ROUTE[user.role], { replace: true })}
        >
          Go to my dashboard
        </Button>
      ) : (
        <Button asChild size="lg" className="mt-6 w-full">
          <Link to="/auth/login">Sign in</Link>
        </Button>
      )}
    </div>
  );
}
