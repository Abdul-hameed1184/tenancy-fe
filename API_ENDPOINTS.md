# PLEET API Contract

This document lists every endpoint the PLEET frontend calls. If the backend implements these paths and shapes, the frontend works with it without code changes.

---

## 1. Connecting the frontend

```bash
cp .env.example .env
# edit .env
VITE_API_BASE_URL=http://localhost:8000/api
npm run dev   # restart after changing .env
```

- If `VITE_API_BASE_URL` is **set**, every call goes to `${VITE_API_BASE_URL}${path}`.
- If it is **empty or missing**, the app uses the built-in mock data, as it did before.
- Leave off the trailing slash. The paths below are relative to the base URL.

The switch lives in `src/lib/api/config.ts`, and the HTTP client is in `src/lib/api/http.ts`. Each feature has `api.mock.ts` (mock data), `api.remote.ts` (real HTTP calls) and `api.ts` (picks one of the two).

---

## 2. Conventions

| Topic | Rule |
|---|---|
| Format | JSON request and response bodies. `Content-Type: application/json`. |
| Auth | `Authorization: Bearer <token>` on every request after login. The token comes from `/auth/login` or `/auth/register`. |
| Envelope | You can return either raw JSON (`[...]` or `{...}`) or `{ "data": ... }`. The client unwraps `data` automatically. |
| Errors | Use a non-2xx status with `{ "message": "Human readable" }`. The message is shown to the user in a toast. `message: string[]` (e.g. NestJS validation) and `{ "error": "..." }` are also accepted. |
| 401 | When a logged-in user gets a 401, the client clears the session and redirects to `/auth/login?returnTo=...`. |
| Dates | ISO-8601 strings, e.g. `2026-09-27T10:00:00.000Z`. |
| IDs | Strings. |
| Money | Plain numbers in Naira, no kobo. `priceAnnual` is yearly rent. |
| Pagination | None. List endpoints return full arrays. |
| Query params | Filters that are unset are left out of the query string. Booleans are sent as `true`. |
| CORS | Allow the frontend origin (dev: `http://localhost:5173`), the `Authorization` and `Content-Type` headers, and the methods `GET, POST, PUT, PATCH, DELETE`. |

---

## 3. Entities

```ts
type Role = "admin" | "landlord" | "agent" | "tenant";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

interface AgentProfile extends User {
  role: "agent";
  agency: string;
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  trustScore: number;            // 0–100
  passportDocUrl?: string;
  thirdPartyCheckRef?: string;
  assetsManagedCount: number;
}

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  photos: string[];              // image URLs
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  priceAnnual: number;
  status: "listed" | "occupied" | "unavailable";
  landlordId: string;
  occupancyRate: number;         // 0–100
  featured?: boolean;
  agentId: string | null;        // REQUIRED in responses: the active managing agent, or null
}

interface PropertyAgentAssignment {
  id: string;
  propertyId: string;
  agentId: string;
  assignedAt: string;
  active: boolean;
}

interface PaymentEntry {
  id: string;
  tenancyId: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  method: "bank_transfer" | "card" | "cash" | "cheque";
  loggedByAgentId: string;
  loggedAt: string;
  status: "paid" | "due" | "overdue";
  note?: string;
}

interface TenancyDetail {        // what every /tenancies endpoint returns
  id: string;
  tenantId: string;
  propertyId: string;
  unit: string;
  leaseStart: string;
  nextDueDate: string;
  paymentHistory: PaymentEntry[];
  tenant: User;                  // embedded
  property: Property;            // embedded (including agentId)
}

interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  issueType: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "reported" | "in_progress" | "completed";
  reportedAt: string;
}

interface Inspection {
  id: string;
  propertyId: string;
  tenantId: string;
  agentId: string;
  prospectName: string;
  requestedAt: string;
  scheduledAt: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
}

interface MessageThread {
  id: string;
  participantIds: string[];
  propertyId?: string;
  lastMessageAt: string;
}

interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  sentAt: string;
  readAt?: string;
}

interface Report {
  id: string;
  type: "listing" | "user";
  targetId: string;              // propertyId or userId
  reason: string;
  reportedById: string;
  status: "open" | "resolved";
  createdAt: string;
}
```

---

## 4. Endpoints

**Roles** column: who calls the endpoint from the UI. "public" means no token is needed.

### 4.1 Auth

| Method | Path | Body / Query | Response | Roles |
|---|---|---|---|---|
| POST | `/auth/login` | `{ role, email, password }` | `{ user: User, token: string }` | public |
| POST | `/auth/register` | `{ role: "landlord"\|"agent"\|"tenant", name, email, password }` | `{ user: User, token: string }` | public |
| GET | `/auth/me` | – | `User` (or `AgentProfile` for agents) | any |
| POST | `/auth/logout` | – | `204` / anything | any |
| POST | `/auth/forgot-password` | `{ email }` | `204` / anything | public |
| POST | `/auth/reset-password` | `{ token, password }` | `204` / anything | public |
| PATCH | `/users/:id` | `{ id, name, phone? }` | `User` | any (own profile) |

- **Login:** `role` is the tab the user picked. Reject the login if the account's role doesn't match, or ignore `role`; the UI routes by `user.role` either way.
- **Session refresh:** `/auth/me` is called once on app load when a token is stored. The client updates the cached user from it.
- **Reset link:** the email link must open `<frontend>/auth/reset-password?token=<token>`. The frontend reads `token` from the URL and sends it back.

### 4.2 Properties

| Method | Path | Body / Query | Response | Roles |
|---|---|---|---|---|
| GET | `/properties` | query: `city?`, `agentId?`, `landlordId?`, `status?`, `search?`, `featured?` | `Property[]` | public, all |
| GET | `/properties/:id` | – | `Property` | public, all |
| POST | `/properties` | `{ title, address, city, state, neighborhood, bedrooms, bathrooms, sqft, priceAnnual, photos: string[], landlordId, featured?, status? }` | `Property` | landlord |
| PATCH | `/properties/:id` | `Partial<Property>` | `Property` | landlord |
| PUT | `/properties/:id/agent` | `{ agentId }` | `PropertyAgentAssignment` | landlord |
| DELETE | `/properties/:id/agent` | – | `204` | landlord |
| GET | `/agents/:agentId/properties/top` | query: `limit` (default 3) | `Property[]` | agent |

- `search` is a case-insensitive match on `title`, `neighborhood` or `city`.
- `agentId` means "properties with an **active** assignment to this agent".
- Public pages call `GET /properties` and `GET /properties?status=listed`, so these must work without a token.
- `POST /properties` sets `status = "listed"` by default, and `occupancyRate = 0`.
- `PUT /properties/:id/agent` deactivates any existing active assignment for that property, then creates a new active one.
- `DELETE /properties/:id/agent` deactivates the active assignment.
- `top` returns the agent's properties sorted by `occupancyRate * priceAnnual` descending, cut to `limit`.

### 4.3 Tenancies

| Method | Path | Query | Response | Roles |
|---|---|---|---|---|
| GET | `/tenancies` | `agentId?`, `landlordId?`, `propertyId?` | `TenancyDetail[]` | agent, landlord |
| GET | `/tenancies/:id` | – | `TenancyDetail` | agent, landlord |
| GET | `/tenants/:tenantId/tenancy` | – | `TenancyDetail` (404 if none) | tenant |

- `agentId` filters by the property's active managing agent.
- `landlordId` filters by `property.landlordId`.

### 4.4 Payments

| Method | Path | Body | Response | Roles |
|---|---|---|---|---|
| GET | `/tenancies/:id/payments` | – | `PaymentEntry[]` sorted by `dueDate` asc | agent, landlord, tenant |
| POST | `/tenancies/:id/payments` | `{ amount, dueDate, paidDate: string\|null, method, status, loggedByAgentId, note? }` | `PaymentEntry` | agent |

- The ledger is append-only: there is no update or delete.
- When `status === "paid"`, set `tenancy.nextDueDate = dueDate + 1 year`.

### 4.5 Maintenance requests

| Method | Path | Body / Query | Response | Roles |
|---|---|---|---|---|
| GET | `/maintenance-requests` | query: `agentId?`, `tenantId?`, `propertyId?`, `status?` | `MaintenanceRequest[]` sorted by `reportedAt` desc | agent, tenant, landlord |
| GET | `/maintenance-requests/:id` | – | `MaintenanceRequest` | any |
| POST | `/maintenance-requests` | `{ propertyId, tenantId, issueType, description, priority }` | `MaintenanceRequest` (`status = "reported"`) | tenant |
| PATCH | `/maintenance-requests/:id` | `{ status }` | `MaintenanceRequest` | agent |

- `agentId` filters by the property's active managing agent.

### 4.6 Inspections

| Method | Path | Body / Query | Response | Roles |
|---|---|---|---|---|
| GET | `/inspections` | query: `agentId?`, `tenantId?`, `propertyId?`, `status?` | `Inspection[]` sorted by `scheduledAt` asc | agent, tenant |
| GET | `/inspections/:id` | – | `Inspection` | any |
| POST | `/inspections` | `{ propertyId, tenantId, agentId, prospectName, scheduledAt }` | `Inspection` (`status = "requested"`, `requestedAt = now`) | tenant |
| POST | `/inspections/:id/confirm` | – | `Inspection` (`confirmed`) | agent |
| POST | `/inspections/:id/complete` | – | `Inspection` (`completed`) | agent |
| POST | `/inspections/:id/cancel` | – | `Inspection` (`cancelled`) | agent, tenant |

- The tenant UI takes `agentId` from `property.agentId`. A property with no agent can't be booked.

### 4.7 Agents and verification

| Method | Path | Body / Query | Response | Roles |
|---|---|---|---|---|
| GET | `/agents` | query: `verificationStatus?` | `AgentProfile[]` | landlord, admin, public (agent cards) |
| GET | `/agents/:id` | – | `AgentProfile` | public, all |
| GET | `/admin/verifications` | – | `AgentProfile[]` where `verificationStatus = "pending"` | admin |
| POST | `/admin/verifications/:agentId` | `{ decision: "verified"\|"rejected" }` | `AgentProfile` | admin |

- On `verified`, set `trustScore = max(trustScore, 80)`.

### 4.8 Messages

| Method | Path | Body / Query | Response | Roles |
|---|---|---|---|---|
| GET | `/threads` | query: `userId` | `MessageThread[]` where the user is a participant, sorted by `lastMessageAt` desc | any |
| GET | `/threads/:id/messages` | – | `Message[]` sorted by `sentAt` asc | participants |
| POST | `/threads/:id/messages` | `{ senderId, body }` | `Message` | participants |

- Check that `userId` and `senderId` match the token's user.
- Sending a message updates `thread.lastMessageAt`.

### 4.9 Reports (flagging)

| Method | Path | Body / Query | Response | Roles |
|---|---|---|---|---|
| GET | `/reports` | query: `status?`, `type?`, `reportedById?` | `Report[]` sorted by `createdAt` desc | admin, landlord (own) |
| GET | `/reports/:id` | – | `Report` | admin |
| POST | `/reports` | `{ type, targetId, reason, reportedById }` | `Report` (`status = "open"`) | landlord, tenant |
| POST | `/reports/:id/resolve` | – | `Report` (`resolved`) | admin |

### 4.10 Dashboard stats

| Method | Path | Response | Roles |
|---|---|---|---|
| GET | `/agents/:id/stats` | `AgentStats` | agent |
| GET | `/landlords/:id/stats` | `LandlordStats` | landlord |

```ts
interface AgentStats {
  activeProperties: number;               // properties with an active assignment to this agent
  activePropertiesNewThisMonth: number;   // of those, assigned this calendar month
  totalTenants: number;                   // tenancies on those properties
  totalTenantsHighPriority: number;       // tenancies overdue or due within 7 days
  maintenancePending: number;             // maintenance on those properties with status != completed
  maintenanceHighPriority: number;        // of those, priority = high
  upcomingInspections: number;            // this agent's inspections with status requested|confirmed
  inspectionsScheduledToday: number;      // of those, scheduledAt is today
}

interface LandlordStats {
  totalPortfolioValue: number;            // estimated asset value of the landlord's properties
  portfolioValueChangePct: number;        // % change vs. previous period
  annualRevenue: number;                  // sum of priceAnnual for occupied properties
  collectionRatePct: number;              // paid ÷ due for the current year, 0–100
  occupancyRatePct: number;               // average occupancyRate, rounded
  vacantUnits: number;                    // properties with status != occupied
  managedAssets: number;                  // property count
  citiesCount: number;                    // distinct cities
}
```

---

## 5. Server-side logic checklist

The mocks currently do these things. The backend needs to do them instead:

1. Include `agentId` (the active managing agent, or `null`) on **every** `Property` in responses, including those embedded in `TenancyDetail`.
2. Apply the `agentId` filter on `/properties`, `/tenancies` and `/maintenance-requests` by joining through active assignments.
3. Embed `tenant` and `property` in every `TenancyDetail`.
4. Apply defaults on create: property (`listed`, occupancy `0`), maintenance (`reported`), inspection (`requested`), report (`open`).
5. When a `paid` payment is logged, move `nextDueDate` forward 1 year.
6. When assigning an agent, deactivate the previous assignment.
7. When an agent is verified, set `trustScore` to at least 80.
8. When a message is sent, update `thread.lastMessageAt`.
9. Compute the stats as defined in 4.10.
10. Enforce role and ownership rules (a landlord only sees their own properties, a tenant only their own tenancy, and so on). The frontend sends ids in filters, but the backend must not trust them.

## 6. Test accounts

In mock mode, the login page shows a demo-account picker. In real-backend mode it is hidden. Seed at least one user per role (`admin`, `landlord`, `agent`, `tenant`) so every dashboard can be tested.
