import { useAuthStore } from "@/features/auth/authStore";
import { API_BASE_URL } from "./config";

export function withLatency<T>(fn: () => T | Promise<T>, opts?: { ms?: number }): Promise<T> {
  const ms = opts?.ms ?? 300 + Math.random() * 500;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    }, ms);
  });
}

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type QueryValue = string | number | boolean | null | undefined;

interface RequestOptions {
  query?: object;
  body?: unknown;
}

function buildUrl(path: string, query?: object) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query) as [string, QueryValue][]) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

function errorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const p = payload as { message?: unknown; error?: unknown };
    if (typeof p.message === "string") return p.message;
    if (Array.isArray(p.message) && typeof p.message[0] === "string") return p.message[0];
    if (typeof p.error === "string") return p.error;
  }
  return fallback;
}

/** Public auth routes that must never trigger a token refresh. */
const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

/** Refresh this many ms before the access token's `exp` so requests don't hit a 401. */
const EXPIRY_SKEW_MS = 30_000;

function tokenExpiresAt(token: string): number | null {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(part)) as { exp?: number };
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
}

function isExpiring(token: string) {
  const exp = tokenExpiresAt(token);
  return exp !== null && exp - Date.now() < EXPIRY_SKEW_MS;
}

let refreshInFlight: Promise<string | null> | null = null;

/**
 * Exchanges the HttpOnly refresh cookie for a new access token (the backend rotates the
 * cookie). Concurrent callers share one request so the rotated cookie isn't reused.
 */
export function refreshAccessToken(): Promise<string | null> {
  refreshInFlight ??= (async () => {
    try {
      const res = await fetch(buildUrl("/auth/refresh"), {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
      });
      if (!res.ok) return null;
      const { token } = (await res.json()) as { token?: string };
      if (!token) return null;
      // Don't resurrect a session the user ended while the refresh was in flight.
      if (useAuthStore.getState().user) useAuthStore.getState().setToken(token);
      return token;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

/**
 * The API locks dashboards for unverified accounts (403 `email_not_verified`). Keep the
 * session, record the flag, and send the user to the "check your inbox" page.
 */
function redirectToVerifyEmail() {
  const { user, setUser } = useAuthStore.getState();
  if (user && user.emailVerified !== false) setUser({ ...user, emailVerified: false });
  if (!window.location.pathname.startsWith("/auth/")) {
    window.location.assign("/auth/verify-email-sent");
  }
}

function endSession() {
  useAuthStore.getState().logout();
  if (window.location.pathname.startsWith("/auth/")) return;
  const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.assign(`/auth/login?returnTo=${returnTo}`);
}

async function request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
  const canRefresh = !NO_REFRESH_PATHS.includes(path);
  const { user } = useAuthStore.getState();
  let { token } = useAuthStore.getState();

  // Signed in but no (or an about-to-expire) access token, e.g. after a page reload.
  if (canRefresh && user && (!token || isExpiring(token))) {
    token = (await refreshAccessToken()) ?? token;
  }

  const send = (accessToken: string | null) => {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (opts.body !== undefined) headers["Content-Type"] = "application/json";
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    return fetch(buildUrl(path, opts.query), {
      method,
      headers,
      credentials: "include",
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  };

  let res: Response;
  try {
    res = await send(token);
    if (res.status === 401 && canRefresh && useAuthStore.getState().user) {
      const fresh = await refreshAccessToken();
      if (!fresh) {
        endSession();
      } else {
        res = await send(fresh);
        if (res.status === 401) endSession();
      }
    }
  } catch {
    throw new ApiError("Can't reach the server — check your connection.", 0);
  }

  const text = await res.text();
  let payload: unknown = undefined;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    if (res.status === 403 && (payload as { code?: string } | undefined)?.code === "email_not_verified") {
      redirectToVerifyEmail();
    }
    throw new ApiError(errorMessage(payload, `Request failed (${res.status})`), res.status, payload);
  }

  // Accept both raw JSON and a `{ data: ... }` envelope.
  if (payload && typeof payload === "object" && !Array.isArray(payload) && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const http = {
  get: <T>(path: string, query?: object) => request<T>("GET", path, { query }),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, { body }),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
