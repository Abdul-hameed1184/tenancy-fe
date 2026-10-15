import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMe } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/authStore";
import { useResendVerification } from "@/features/auth/hooks/useEmailVerification";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useSession } from "@/features/auth/hooks/useSession";
import { ROLE_HOME_ROUTE } from "@/lib/constants";

const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Where unverified users land after register/login, and where the dashboard guard sends
 * them. Dashboards stay locked (the API answers 403 email_not_verified) until they verify.
 */
export default function CheckEmailPage() {
  const user = useSession();
  const navigate = useNavigate();
  const logout = useLogout();
  const resend = useResendVerification();
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Already verified (e.g. verified in another tab): nothing to do here.
  useEffect(() => {
    if (user?.emailVerified !== false) {
      if (user) navigate(ROLE_HOME_ROUTE[user.role], { replace: true });
    }
  }, [user, navigate]);

  const sendAgain = () => {
    resend.mutate(user ? {} : { email }, { onSuccess: () => setCooldown(RESEND_COOLDOWN_SECONDS) });
  };

  const checkAgain = async () => {
    setChecking(true);
    try {
      const fresh = await getMe();
      useAuthStore.getState().setUser(fresh);
      if (!fresh.emailVerified) toast.info("Not verified yet — open the link in the email first.");
    } catch {
      toast.error("Couldn't check right now — try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      <MailCheck className="h-12 w-12 text-brand-500" />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Verify your email</h1>
      <p className="mt-2 text-sm text-slate-500">
        {user ? (
          <>
            We sent a verification link to <span className="font-medium text-slate-700">{user.email}</span>.
            Open it to unlock your dashboard. The link expires in 3 days.
          </>
        ) : (
          "Enter your email and we'll send you a new verification link."
        )}
      </p>

      {!user && (
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-6 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      )}

      <div className="mt-6 space-y-3">
        {user && (
          <Button size="lg" className="w-full" onClick={checkAgain} disabled={checking}>
            {checking ? "Checking..." : "I've verified — continue"}
          </Button>
        )}
        <Button
          size="lg"
          variant={user ? "outline" : "default"}
          className={
            user ? "w-full border-slate-200 text-slate-700 hover:bg-slate-50" : "w-full"
          }
          onClick={sendAgain}
          disabled={resend.isPending || cooldown > 0 || (!user && !email)}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : resend.isPending ? "Sending..." : "Resend email"}
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        {user ? (
          <button type="button" onClick={logout} className="font-medium text-brand-600 hover:text-brand-700">
            Sign out
          </button>
        ) : (
          <Link to="/auth/login" className="font-medium text-brand-600 hover:text-brand-700">
            Back to sign in
          </Link>
        )}
      </p>
    </div>
  );
}
