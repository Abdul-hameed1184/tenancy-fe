import { useAuthStore } from "../authStore";

export function useSession() {
  return useAuthStore((state) => state.user);
  
}
