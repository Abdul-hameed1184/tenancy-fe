import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/features/auth/schemas";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });
  const { mutate, isPending, isSuccess, isError, error } = useForgotPassword();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Reset Your Password</h1>
      <p className="mt-1 text-sm text-slate-500">
        Enter the email tied to your PLEET account and we'll send a reset link.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => mutate(values))}>
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

        {isError && <p className="text-sm text-red-600">{error.message}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={isPending || isSuccess}>
          {isSuccess ? "Link sent" : isPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link to="/auth/login" className="font-medium text-brand-600 hover:text-brand-700">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
