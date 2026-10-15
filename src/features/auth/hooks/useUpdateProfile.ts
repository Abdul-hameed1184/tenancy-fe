import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProfile } from "../api";
import { useAuthStore } from "../authStore";
import type { ProfilePatch } from "../types";

export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: ({ id, ...patch }: ProfilePatch & { id: string }) => updateProfile(id, { id, ...patch }),
    onSuccess: (user) => {
      setUser(user);
      toast.success("Profile updated.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Couldn't update your profile — try again.");
    },
  });
}
