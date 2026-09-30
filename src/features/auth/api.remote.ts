import { http } from "@/lib/api/http";
import type { User } from "@/types/entities";
import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "./types";

export const login = (input: LoginInput) => http.post<AuthResponse>("/auth/login", input);

export const register = (input: RegisterInput) => http.post<AuthResponse>("/auth/register", input);

export const getMe = () => http.get<User>("/auth/me");

export const logout = () => http.post<void>("/auth/logout");

export const updateProfile = (id: string, patch: Pick<User, "name" | "phone">) =>
  http.patch<User>(`/users/${id}`, patch);

export const forgotPassword = (input: ForgotPasswordInput) =>
  http.post<void>("/auth/forgot-password", input);

export const resetPassword = (input: ResetPasswordInput) =>
  http.post<void>("/auth/reset-password", input);
