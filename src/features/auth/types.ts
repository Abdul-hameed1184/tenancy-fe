import type { Role, User } from "@/types/entities";

export interface LoginInput {
  role: Role;
  email: string;
  password: string;
}

export interface RegisterInput {
  role: Role;
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  /** Reset token from the emailed link (`?token=`). */
  token?: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
