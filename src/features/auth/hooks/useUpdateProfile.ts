import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProfile } from "../api";
import { useAuthStore } from "../authStore";
import type { User } from "@/types/entities";

export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (input: Pick<User, "id" | "name" | "phone">) => updateProfile(input.id, input),
    onSuccess: (user) => {
      setUser(user);
      toast.success("Profile updated.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Couldn't update your profile — try again.");
    },
  });
}
