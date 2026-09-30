import { redirect } from "react-router-dom";
import { ROLE_HOME_ROUTE } from "@/lib/constants";
import type { Role } from "@/types/entities";
import { useAuthStore } from "./authStore";

export function requireAuth(currentPath: string) {
  const { user } = useAuthStore.getState();
  if (!user) {
    throw redirect(`/auth/login?returnTo=${encodeURIComponent(currentPath)}`);
  }
  return user;
}

export function requireRole(role: Role) {
  return ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const user = requireAuth(url.pathname);
    if (user.role !== role) {
      throw redirect(ROLE_HOME_ROUTE[user.role]);
    }
    return user;
  };
}
