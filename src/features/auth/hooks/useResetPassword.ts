import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "../api";
import type { ResetPasswordInput } from "../types";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: ResetPasswordInput) => resetPassword(input),
    onSuccess: () => {
      toast.success("Password updated — sign in with your new password.");
      navigate("/auth/login", { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Couldn't reset your password — try again.");
    },
  });
}
