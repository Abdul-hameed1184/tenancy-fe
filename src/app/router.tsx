import type { ComponentType } from "react";
import { createBrowserRouter } from "react-router-dom";
import { requireRole } from "@/features/auth/guards";

function lazyPage(importer: () => Promise<{ default: ComponentType }>) {
  return async () => {
    const mod = await importer();
    return { Component: mod.default };
  };
}

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: lazyPage(() => import("@/routes/public/PublicLayout")),
    children: [
      { index: true, lazy: lazyPage(() => import("@/routes/public/LandingPage")) },
      { path: "rentals", lazy: lazyPage(() => import("@/routes/public/RentalsPage")) },
      {
        path: "rentals/:propertyId",
        lazy: lazyPage(() => import("@/routes/public/PropertyDetailPage")),
      },
      { path: "agents", lazy: lazyPage(() => import("@/routes/public/AgentsInfoPage")) },
      { path: "management", lazy: lazyPage(() => import("@/routes/public/ManagementInfoPage")) },
    ],
  },
  {
    path: "/auth",
    lazy: lazyPage(() => import("@/routes/auth/AuthLayout")),
    children: [
      { path: "login", lazy: lazyPage(() => import("@/routes/auth/LoginPage")) },
      { path: "reset-password", lazy: lazyPage(() => import("@/routes/auth/ResetPassword")) },
      { path: "register", lazy: lazyPage(() => import("@/routes/auth/RegisterPage")) },
      { path: "forgot-password", lazy: lazyPage(() => import("@/routes/auth/ForgotPasswordPage")) },
    ],
  },
  {
    path: "/agent",
    loader: requireRole("agent"),
    lazy: lazyPage(() => import("@/routes/agent/AgentDashboardLayout")),
    children: [
      { index: true, lazy: lazyPage(() => import("@/routes/agent/AgentDashboardHome")) },
      { path: "properties", lazy: lazyPage(() => import("@/routes/agent/AgentPropertiesPage")) },
      {
        path: "properties/:propertyId",
        lazy: lazyPage(() => import("@/routes/agent/AgentPropertyDetailPage")),
      },
      { path: "tenants", lazy: lazyPage(() => import("@/routes/agent/AgentTenantsPage")) },
      { path: "tenants/:tenantId", lazy: lazyPage(() => import("@/routes/agent/AgentTenantDetailPage")) },
      { path: "maintenance", lazy: lazyPage(() => import("@/routes/agent/AgentMaintenancePage")) },
      { path: "inspections", lazy: lazyPage(() => import("@/routes/agent/AgentInspectionsPage")) },
      { path: "messages", lazy: lazyPage(() => import("@/routes/agent/AgentMessagesPage")) },
      { path: "settings", lazy: lazyPage(() => import("@/routes/agent/AgentSettingsPage")) },
    ],
  },
  {
    path: "/landlord",
    loader: requireRole("landlord"),
    lazy: lazyPage(() => import("@/routes/landlord/LandlordDashboardLayout")),
    children: [
      { index: true, lazy: lazyPage(() => import("@/routes/landlord/LandlordOverviewPage")) },
      { path: "properties", lazy: lazyPage(() => import("@/routes/landlord/LandlordPropertiesPage")) },
      {
        path: "properties/:propertyId",
        lazy: lazyPage(() => import("@/routes/landlord/LandlordPropertyDetailPage")),
      },
      { path: "agents", lazy: lazyPage(() => import("@/routes/landlord/LandlordAgentsPage")) },
      { path: "agents/:agentId", lazy: lazyPage(() => import("@/routes/landlord/LandlordAgentDetailPage")) },
      { path: "finances", lazy: lazyPage(() => import("@/routes/landlord/LandlordFinancesPage")) },
      { path: "reports", lazy: lazyPage(() => import("@/routes/landlord/LandlordReportsPage")) },
      { path: "reports/:reportId", lazy: lazyPage(() => import("@/routes/landlord/LandlordReportDetailPage")) },
      { path: "settings", lazy: lazyPage(() => import("@/routes/landlord/LandlordSettingsPage")) },
    ],
  },
  {
    path: "/tenant",
    loader: requireRole("tenant"),
    lazy: lazyPage(() => import("@/routes/tenant/TenantDashboardLayout")),
    children: [
      { index: true, lazy: lazyPage(() => import("@/routes/tenant/TenantHomePage")) },
      { path: "explore", lazy: lazyPage(() => import("@/routes/tenant/TenantExplorePage")) },
      { path: "maintenance", lazy: lazyPage(() => import("@/routes/tenant/TenantMaintenancePage")) },
      { path: "payments", lazy: lazyPage(() => import("@/routes/tenant/TenantPaymentsPage")) },
      { path: "messages", lazy: lazyPage(() => import("@/routes/tenant/TenantMessagesPage")) },
      { path: "settings", lazy: lazyPage(() => import("@/routes/tenant/TenantSettingsPage")) },
    ],
  },
  {
    path: "/admin",
    loader: requireRole("admin"),
    lazy: lazyPage(() => import("@/routes/admin/AdminDashboardLayout")),
    children: [
      { index: true, lazy: lazyPage(() => import("@/routes/admin/AdminOverviewPage")) },
      {
        path: "verifications",
        lazy: lazyPage(() => import("@/routes/admin/AdminVerificationQueuePage")),
      },
      {
        path: "verifications/:agentId",
        lazy: lazyPage(() => import("@/routes/admin/AdminVerificationDetailPage")),
      },
      { path: "reports", lazy: lazyPage(() => import("@/routes/admin/AdminReportsPage")) },
      { path: "reports/:reportId", lazy: lazyPage(() => import("@/routes/admin/AdminReportDetailPage")) },
      { path: "settings", lazy: lazyPage(() => import("@/routes/admin/AdminSettingsPage")) },
    ],
  },
  { path: "*", lazy: lazyPage(() => import("@/routes/NotFoundPage")) },
]);
