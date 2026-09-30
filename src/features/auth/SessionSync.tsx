import { useEffect } from "react";
import { USE_MOCKS } from "@/lib/api/config";
import { getMe } from "./api";
import { useAuthStore } from "./authStore";

/** On load, refreshes the persisted user from the backend (401s log out via the http client). */
export function SessionSync() {
  useEffect(() => {
    if (USE_MOCKS || !useAuthStore.getState().token) return;
    getMe()
      .then((user) => useAuthStore.getState().setUser(user))
      .catch(() => undefined);
  }, []);

  return null;
}
