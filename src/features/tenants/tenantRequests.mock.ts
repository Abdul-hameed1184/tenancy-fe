import { useAuthStore } from "@/features/auth/authStore";
import { withLatency } from "@/lib/api/http";
import { genId, db } from "@/mocks/db";
import type { TenantChangeRequest, TenantCandidate } from "./tenantRequests";

function assertAssignedAgent(propertyId: string) {
  const user = useAuthStore.getState().user;
  const assigned = db.agentAssignments.some(
    (assignment) =>
      assignment.propertyId === propertyId &&
      assignment.agentId === user?.id &&
      assignment.active,
  );
  if (!assigned)
    throw new Error("You are not the active agent for this property.");
}

export const searchTenantCandidates = (
  propertyId: string,
  search: string,
): Promise<TenantCandidate[]> =>
  withLatency(() => {
    assertAssignedAgent(propertyId);
    const query = search.trim().toLowerCase();
    if (query.length < 2) return [];
    const occupied = new Set(db.tenancies.map((tenancy) => tenancy.tenantId));
    const pending = new Set(
      db.tenantRequests
        .filter(
          (request) =>
            request.status === "pending" && request.action === "assign",
        )
        .map((request) => request.tenantId),
    );
    return db.users
      .filter(
        (user) =>
          user.role === "tenant" && user.name.toLowerCase().includes(query),
      )
      .filter((user) => !occupied.has(user.id) && !pending.has(user.id))
      .slice(0, 10)
      .map(({ id, name }) => ({ id, name }));
  });

export const getTenantChangeRequests = (
  propertyId: string,
): Promise<TenantChangeRequest[]> =>
  withLatency(() => {
    const user = useAuthStore.getState().user;
    const property = db.properties.find((row) => row.id === propertyId);
    if (!property) throw new Error("Property not found.");
    if (user?.id !== property.landlordId) assertAssignedAgent(propertyId);
    return db.tenantRequests.filter(
      (request) => request.propertyId === propertyId,
    );
  });

export const requestTenantAssignment = (
  propertyId: string,
  tenantId: string,
  unit: string,
  leaseStart: string,
  nextDueDate: string,
): Promise<TenantChangeRequest> =>
  withLatency(() =>
    createRequest(
      propertyId,
      tenantId,
      "assign",
      unit,
      leaseStart,
      nextDueDate,
    ),
  );

export const requestTenantRemoval = (
  propertyId: string,
  tenantId: string,
): Promise<TenantChangeRequest> =>
  withLatency(() => createRequest(propertyId, tenantId, "remove", "", "", ""));

function createRequest(
  propertyId: string,
  tenantId: string,
  action: TenantChangeRequest["action"],
  unit: string,
  leaseStart: string,
  nextDueDate: string,
) {
  assertAssignedAgent(propertyId);
  const property = db.properties.find((row) => row.id === propertyId);
  const tenant = db.users.find(
    (row) => row.id === tenantId && row.role === "tenant",
  );
  const agent = useAuthStore.getState().user;
  if (!property || !tenant || !agent) throw new Error("Choose a valid tenant.");
  const request: TenantChangeRequest = {
    id: genId("tenant-request"),
    propertyId,
    tenantId,
    tenantName: tenant.name,
    action,
    status: "pending",
    unit,
    leaseStart: leaseStart || null,
    nextDueDate: nextDueDate || null,
    createdAt: new Date().toISOString(),
  };
  db.tenantRequests.unshift(request);
  db.notifications.unshift({
    id: genId("notification"),
    recipientId: property.landlordId,
    type: "tenant_assignment_request",
    title: "Tenant change needs approval",
    message: `${agent.name} requested to ${action} ${tenant.name} at ${property.title}.`,
    data: {
      tenantAssignmentRequestId: request.id,
      propertyId,
      tenantId,
      tenantName: tenant.name,
      action,
    },
    isRead: false,
    createdAt: request.createdAt,
  });
  return request;
}

export const decideTenantChangeRequest = (
  requestId: string,
  decision: "approve" | "reject",
): Promise<TenantChangeRequest> =>
  withLatency(() => {
    const user = useAuthStore.getState().user;
    const request = db.tenantRequests.find(
      (row) => row.id === requestId && row.status === "pending",
    );
    const property = db.properties.find(
      (row) => row.id === request?.propertyId,
    );
    if (!request || !property || user?.id !== property.landlordId) {
      throw new Error("You cannot decide this tenant request.");
    }
    if (decision === "approve") {
      if (request.action === "assign") {
        db.tenancies.push({
          id: genId("tenancy"),
          tenantId: request.tenantId,
          propertyId: request.propertyId,
          unit: request.unit,
          leaseStart: request.leaseStart ?? "",
          nextDueDate: request.nextDueDate ?? "",
          paymentHistory: [],
        });
      } else {
        db.tenancies = db.tenancies.filter(
          (tenancy) =>
            !(
              tenancy.propertyId === request.propertyId &&
              tenancy.tenantId === request.tenantId
            ),
        );
      }
      request.status = "approved";
    } else {
      request.status = "rejected";
    }
    for (const notification of db.notifications) {
      if (notification.data.tenantAssignmentRequestId === request.id) {
        notification.data.requestStatus = request.status;
        notification.isRead = true;
      }
    }
    return request;
  });
