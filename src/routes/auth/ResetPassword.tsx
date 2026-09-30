import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/features/auth/schemas";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  const { mutate, isPending, isError, error } = useResetPassword();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((values) => mutate({ token, password: values.password }))}
      >
        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Enter your new password
          </label>
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
        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
            Confirm Password
          </label>
          <div className="relative mt-1">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {isError && <p className="text-sm text-red-600">{error.message}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Updating..." : "Reset Password"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remembered your password?{" "}
        <Link to="/auth/login" className="font-medium text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
