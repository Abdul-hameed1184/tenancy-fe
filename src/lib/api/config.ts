/** Backend base URL. Set VITE_API_BASE_URL in .env — leave it empty to use mock data. */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");

export const USE_MOCKS = API_BASE_URL === "";
