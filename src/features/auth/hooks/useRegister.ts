import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROLE_HOME_ROUTE } from "@/lib/constants";
import { register } from "../api";
import { useAuthStore } from "../authStore";
import type { RegisterInput } from "../types";

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: ({ user, token }) => {
      setSession(user, token);
      toast.success(`Account created — welcome to PLEET, ${user.name.split(" ")[0]}.`);
      navigate(ROLE_HOME_ROUTE[user.role], { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Couldn't create your account — try again.");
    },
  });
}
