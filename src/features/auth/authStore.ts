import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/entities";

interface AuthState {
  user: User | null;
  /** Short-lived access token. Kept in memory only — the refresh token lives in an HttpOnly cookie. */
  token: string | null;
  setSession: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: (user, token) => set({ user, token }),
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "pleet-auth",
      // Only the user profile is persisted; a fresh access token is obtained via /auth/refresh.
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
