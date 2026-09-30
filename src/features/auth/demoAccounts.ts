import { allUsers } from "@/mocks/seed/users.seed";
import { USE_MOCKS } from "@/lib/api/config";
import type { Role } from "@/types/entities";

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/** Demo-account picker is only shown when running on mock data. */
export const DEMO_ACCOUNTS: DemoAccount[] = USE_MOCKS
  ? allUsers
      .filter((u) => u.role !== "tenant" || u.id === "tenant-1")
      .map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role }))
  : [];
