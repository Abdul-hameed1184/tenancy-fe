import { http } from "@/lib/api/http";
import type { User } from "@/types/entities";
import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  ProfilePatch,
  RegisterInput,
  RegisterResponse,
  ResendVerificationInput,
  ResetPasswordInput,
} from "./types";

export const login = ({ email, password }: LoginInput) =>
  http.post<AuthResponse>("/auth/login", { email, password });

export const register = (input: RegisterInput) => http.post<RegisterResponse>("/auth/register", input);

export const getMe = () => http.get<User>("/auth/me");

export const logout = () => http.post<void>("/auth/logout");

export const updateProfile = (id: string, patch: ProfilePatch) =>
  http.patch<User>(`/users/${id}`, patch);

export const forgotPassword = (input: ForgotPasswordInput) =>
  http.post<void>("/auth/forgot-password", input);

export const resetPassword = (input: ResetPasswordInput) =>
  http.post<void>("/auth/reset-password", input);

/** Consumes the emailed link's token and returns the now-verified user. */
export const verifyEmail = (token: string) => http.post<User>("/auth/verify-email", { token });

/** Signed in: re-sends for the current account. Signed out: pass the email. Always 204. */
export const resendVerification = (input: ResendVerificationInput = {}) =>
  http.post<void>("/auth/resend-verification", input);
