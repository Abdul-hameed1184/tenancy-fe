export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
  },
  properties: {
    all: ["properties"] as const,
    list: (filters?: object) => ["properties", "list", filters] as const,
    detail: (id: string) => ["properties", "detail", id] as const,
    topPerforming: (agentId: string) => ["properties", "top", agentId] as const,
    byLandlord: (landlordId: string) => ["properties", "byLandlord", landlordId] as const,
  },
  tenants: {
    all: ["tenants"] as const,
    list: () => ["tenants", "list"] as const,
    detail: (id: string) => ["tenants", "detail", id] as const,
    byProperty: (propertyId: string) => ["tenants", "byProperty", propertyId] as const,
    myTenancy: (tenantId: string) => ["tenants", "myTenancy", tenantId] as const,
  },
  payments: {
    history: (tenancyId: string) => ["payments", "history", tenancyId] as const,
  },
  maintenance: {
    all: ["maintenance"] as const,
    list: (filters?: object) => ["maintenance", "list", filters] as const,
    detail: (id: string) => ["maintenance", "detail", id] as const,
  },
  inspections: {
    all: ["inspections"] as const,
    list: (filters?: object) => ["inspections", "list", filters] as const,
    detail: (id: string) => ["inspections", "detail", id] as const,
  },
  agents: {
    all: ["agents"] as const,
    list: (filters?: object) => ["agents", "list", filters] as const,
    detail: (id: string) => ["agents", "detail", id] as const,
    verificationQueue: () => ["agents", "verificationQueue"] as const,
  },
  messages: {
    threads: (userId: string) => ["messages", "threads", userId] as const,
    thread: (threadId: string) => ["messages", "thread", threadId] as const,
  },
  reports: {
    list: (filters?: object) => ["reports", "list", filters] as const,
    detail: (id: string) => ["reports", "detail", id] as const,
  },
  dashboardStats: {
    agent: (agentId: string) => ["dashboardStats", "agent", agentId] as const,
    landlord: (landlordId: string) => ["dashboardStats", "landlord", landlordId] as const,
  },
} as const;
