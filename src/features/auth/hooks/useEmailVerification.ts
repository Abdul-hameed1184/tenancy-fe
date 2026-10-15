import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resendVerification, verifyEmail } from "../api";
import { useAuthStore } from "../authStore";
import type { ResendVerificationInput } from "../types";

/** Consumes the token from the emailed link. Updates the signed-in user, if any. */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
    onSuccess: (user) => {
      const current = useAuthStore.getState().user;
      if (current && current.id === user.id) useAuthStore.getState().setUser(user);
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (input: ResendVerificationInput = {}) => resendVerification(input),
    onSuccess: () => toast.success("Verification email sent — check your inbox."),
    onError: (error: Error) =>
      toast.error(error.message || "Couldn't send the email — try again shortly."),
  });
}
