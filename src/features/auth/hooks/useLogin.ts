import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ROLE_HOME_ROUTE } from "@/lib/constants";
import { login } from "../api";
import { useAuthStore } from "../authStore";
import type { LoginInput } from "../types";

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: ({ user, token }) => {
      setSession(user, token);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}.`);
      const returnTo = searchParams.get("returnTo");
      navigate(returnTo || ROLE_HOME_ROUTE[user.role], { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Couldn't sign you in — try again.");
    },
  });
}
