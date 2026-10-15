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

export interface RegisterResponse {
  message: string;
}

/** `avatarUrl` must be a Cloudinary URL from the signed-upload flow, or "" to remove it. */
export type ProfilePatch = Partial<Pick<User, "name" | "phone" | "avatarUrl">> & { id?: string };

export interface ResendVerificationInput {
  /** Only needed when signed out; a signed-in user always gets it for their own account. */
  email?: string;
}
