import { useEffect } from "react";
import { USE_MOCKS } from "@/lib/api/config";
import { getMe } from "./api";
import { useAuthStore } from "./authStore";

/**
 * On load, restores the session for a persisted user: the http client exchanges the refresh
 * cookie for an access token, then the profile is re-fetched. A dead session logs out.
 */
export function SessionSync() {
  useEffect(() => {
    if (USE_MOCKS || !useAuthStore.getState().user) return;
    getMe()
      .then((user) => useAuthStore.getState().setUser(user))
      .catch(() => undefined);
  }, []);

  return null;
}
