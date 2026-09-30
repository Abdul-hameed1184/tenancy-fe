import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword } from "../api";
import type { ForgotPasswordInput } from "../types";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => forgotPassword(input),
    onSuccess: () => {
      toast.success("Reset link sent — check your inbox.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Couldn't send the reset link — try again.");
    },
  });
}
