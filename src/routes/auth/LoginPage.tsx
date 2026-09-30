import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNTS } from "@/features/auth/demoAccounts";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import type { Role } from "@/types/entities";
import { cn } from "@/lib/utils";
import { Building2, Eye, EyeOff, Shield, ShieldCheck, Users2 } from "lucide-react";

const DEMO_PASSWORD = "demo1234";

const roleTabs: { role: Role; label: string; icon: React.ReactNode }[] = [
  { role: "landlord", label: "Landlord", icon: <Building2 /> },
  { role: "agent", label: "Agent", icon: <Shield /> },
  { role: "tenant", label: "Tenant", icon: <Users2 /> },
  { role: "admin", label: "Admin", icon: <ShieldCheck /> },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "tenant" },
  });
  const { mutate, isPending, isError, error } = useLogin();
  const role = watch("role");
  const accountsForRole = DEMO_ACCOUNTS.filter((a) => a.role === role);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
      <p className="mt-1 text-sm text-slate-500">Select your role and enter your credentials.</p>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">I am a...</p>
        <div className="grid grid-cols-4 gap-2">
          {roleTabs.map((tab) => (
            <button
              key={tab.role}
              type="button"
              onClick={() => {
                setValue("role", tab.role);
                setValue("email", "");
                setValue("password", "");
              }}
              className={cn(
                "rounded-md border px-2 py-3 text-xs font-medium transition-colors flex items-center justify-center flex-col gap-2 text-center",
                role === tab.role
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 text-slate-500 hover:border-slate-300",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {accountsForRole.length > 0 && (
        <div className="mt-4">
          <label htmlFor="demoAccount" className="text-sm font-medium text-slate-700">
            Demo account
          </label>
          <select
            id="demoAccount"
            defaultValue=""
            onChange={(e) => {
              const account = accountsForRole.find((a) => a.id === e.target.value);
              if (account) {
                setValue("email", account.email);
                setValue("password", DEMO_PASSWORD);
              }
            }}
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="" disabled>
              Pick a seeded {role} to sign in as…
            </option>
            {accountsForRole.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} — {account.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <form
        className="mt-4 space-y-4"
        onSubmit={handleSubmit((values) => mutate(values))}
      >
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            {...register("email")}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <Link to="/auth/forgot-password" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        {isError && <p className="text-sm text-red-600">{error.message}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link to="/auth/register" className="font-medium text-brand-600 hover:text-brand-700">
          Register now
        </Link>
      </p>
    </div>
  );
}
