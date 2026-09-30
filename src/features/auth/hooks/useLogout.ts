import { useNavigate } from "react-router-dom";
import { logout as logoutRequest } from "../api";
import { useAuthStore } from "../authStore";

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return () => {
    logoutRequest().catch(() => undefined);
    logout();
    navigate("/", { replace: true });
  };
}
