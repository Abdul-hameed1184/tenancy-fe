import { redirect } from "react-router-dom";
import { ROLE_HOME_ROUTE, VERIFY_EMAIL_NOTICE_ROUTE } from "@/lib/constants";
import type { Role, User } from "@/types/entities";
import { useAuthStore } from "./authStore";

/** Accounts registered before verification existed (and mock users) have no flag: allowed. */
export const needsEmailVerification = (user: User) => user.emailVerified === false;

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
    // Dashboards are locked until the email is verified (the API enforces this too).
    if (needsEmailVerification(user)) {
      throw redirect(VERIFY_EMAIL_NOTICE_ROUTE);
    }
    if (user.role !== role) {
      throw redirect(ROLE_HOME_ROUTE[user.role]);
    }
    return user;
  };
}
