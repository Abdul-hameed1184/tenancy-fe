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

async function request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, opts.query), {
      method,
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
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
    if (res.status === 401 && token) {
      useAuthStore.getState().logout();
      const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.assign(`/auth/login?returnTo=${returnTo}`);
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
