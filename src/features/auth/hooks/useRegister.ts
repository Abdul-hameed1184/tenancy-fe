import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { VERIFY_EMAIL_NOTICE_ROUTE } from "@/lib/constants";
import { register } from "../api";
import type { RegisterInput } from "../types";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: (_data, variables) => {
      toast.success(
        `Account created — check ${variables.email} to verify your email.`,
      );
      navigate(VERIFY_EMAIL_NOTICE_ROUTE, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Couldn't create your account — try again.");
    },
  });
}
