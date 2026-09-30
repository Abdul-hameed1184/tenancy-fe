import { withLatency } from "@/lib/api/http";
import { db, genId } from "@/mocks/db";
import { adminUser, landlordUser, tenantUser } from "@/mocks/seed/users.seed";
import type { Role, User } from "@/types/entities";
import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "./types";

const MOCK_TOKEN = "mock-token";

/**
 * There is no real backend yet — logging in as a role returns that role's
 * canonical seeded demo user, so every dashboard has consistent, pre-populated
 * data to work against. Email/password are only checked for presence.
 */
function demoUserForRole(role: Role): User {
  switch (role) {
    case "landlord":
      return landlordUser;
    case "tenant":
      return tenantUser;
    case "admin":
      return adminUser;
    case "agent": {
      const agent = db.users.find((u) => u.role === "agent");
      if (!agent) throw new Error("No seeded agent found");
      return agent;
    }
  }
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return withLatency(() => {
    if (!input.email || !input.password) {
      throw new Error("Email and password are required");
    }
    const match = db.users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
    return { user: match ?? demoUserForRole(input.role), token: MOCK_TOKEN };
  });
}

export function getMe(): Promise<User> {
  return withLatency(() => {
    throw new Error("No session endpoint in mock mode");
  });
}

export function logout(): Promise<void> {
  return Promise.resolve();
}

export function updateProfile(id: string, patch: Pick<User, "name" | "phone">): Promise<User> {
  return withLatency(() => {
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error(`User ${id} not found`);
    db.users[idx] = { ...db.users[idx], ...patch };
    return db.users[idx];
  });
}

export function register(input: RegisterInput): Promise<AuthResponse> {
  return withLatency(() => {
    const user: User = {
      id: genId("user"),
      name: input.name,
      email: input.email,
      role: input.role,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    return { user, token: MOCK_TOKEN };
  });
}

export function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  return withLatency(() => {
    if (!input.email) {
      throw new Error("Email is required");
    }
  });
}

export function resetPassword(input: ResetPasswordInput): Promise<void> {
  return withLatency(() => {
    if (!input.password) {
      throw new Error("Password is required");
    }
  });
}
