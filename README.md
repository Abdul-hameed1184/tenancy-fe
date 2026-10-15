# PLEET Frontend

React 19 + TypeScript application for PLEET, a property and tenancy management platform. It provides role-based dashboards for landlords, agents, tenants, and administrators, plus public property discovery and account flows.

## Architecture

- `src/app`: router, React Query client, and application providers.
- `src/routes`: route-level screens grouped by public, auth, landlord, agent, tenant, and admin areas.
- `src/features`: domain API clients, hooks, schemas, and feature components. Each API switches between remote and mock implementations using `USE_MOCKS`.
- `src/components`: shared UI primitives, layout, tables, status displays, and reusable property/media components.
- `src/stores`: small client-side stores for session and dashboard dialogs.
- `src/mocks`: deterministic demo users, properties, relationships, and API data.
- `src/types`: shared frontend entity and status contracts.

Server state is fetched and invalidated with TanStack Query. Forms use React Hook Form and Zod validation. The frontend communicates with the Django API using the `/api/v1` contract and opens authenticated WebSocket connections for realtime chat and notifications.

## Requirements

- Node.js 20.19+ or 22.12+ (Vite 8 requirement)
- npm
- The PLEET backend for remote mode, or mock mode for local UI development

## Local development

```bash
npm install
```

Create `.env.local` in this directory:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_USE_MOCKS=false
```

Run the frontend:

```bash
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`. Set `VITE_USE_MOCKS=true` to use in-memory seed data without a backend.

## Commands

```bash
npm run build     # TypeScript project build and Vite production bundle
npm run lint      # Oxlint
npm run preview   # Serve the production bundle locally
```

## Property media and state data

Property images and videos upload directly from the browser to Cloudinary using short-lived signatures issued by the backend. The Cloudinary secret is never sent to this application. Nigerian states are loaded from `https://nga-states-lga.onrender.com/fetch` and cached for 24 hours; a local complete state list is used when the external service is unavailable.

Square footage is optional. Screens show an explicit “not provided” label for listings without an area value.

## Related documentation

- Backend architecture and API: [`../tenancy-backend/README.md`](../tenancy-backend/README.md)
- Backend deployment: [`../DEPLOYMENT.md`](../DEPLOYMENT.md)
- API endpoint contract: [`API_ENDPOINTS.md`](API_ENDPOINTS.md)
