import type { PaymentEntry, TenantPropertyRecord } from "@/types/entities";

function daysFromNow(days: number) {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const tenant1PaymentHistory: PaymentEntry[] = [
  {
    id: "pay-1",
    tenancyId: "tenancy-1",
    amount: 2_000_000,
    dueDate: daysFromNow(-620),
    paidDate: daysFromNow(-620),
    method: "bank_transfer",
    loggedByAgentId: "agent-1",
    loggedAt: daysFromNow(-620),
    status: "paid",
    note: "Security deposit",
  },
  {
    id: "pay-2",
    tenancyId: "tenancy-1",
    amount: 12_000_000,
    dueDate: daysFromNow(-615),
    paidDate: daysFromNow(-614),
    method: "bank_transfer",
    loggedByAgentId: "agent-1",
    loggedAt: daysFromNow(-614),
    status: "paid",
    note: "Annual rent — year 1",
  },
  {
    id: "pay-3",
    tenancyId: "tenancy-1",
    amount: 12_000_000,
    dueDate: daysFromNow(-250),
    paidDate: daysFromNow(-252),
    method: "bank_transfer",
    loggedByAgentId: "agent-1",
    loggedAt: daysFromNow(-250),
    status: "paid",
    note: "Annual rent — year 2",
  },
  {
    id: "pay-4",
    tenancyId: "tenancy-1",
    amount: 12_000_000,
    dueDate: daysFromNow(23),
    paidDate: null,
    method: "bank_transfer",
    loggedByAgentId: "agent-1",
    loggedAt: daysFromNow(-30),
    status: "due",
    note: "Annual rent — year 3",
  },
];

const tenant2PaymentHistory: PaymentEntry[] = [
  {
    id: "pay-5",
    tenancyId: "tenancy-2",
    amount: 18_500_000,
    dueDate: daysFromNow(-180),
    paidDate: daysFromNow(-181),
    method: "card",
    loggedByAgentId: "agent-1",
    loggedAt: daysFromNow(-180),
    status: "paid",
    note: "Annual rent",
  },
];

const tenant3PaymentHistory: PaymentEntry[] = [
  {
    id: "pay-6",
    tenancyId: "tenancy-3",
    amount: 6_500_000,
    dueDate: daysFromNow(-10),
    paidDate: null,
    method: "bank_transfer",
    loggedByAgentId: "agent-1",
    loggedAt: daysFromNow(-40),
    status: "overdue",
    note: "Annual rent",
  },
];

const tenant4PaymentHistory: PaymentEntry[] = [
  {
    id: "pay-7",
    tenancyId: "tenancy-4",
    amount: 25_000_000,
    dueDate: daysFromNow(-400),
    paidDate: daysFromNow(-401),
    method: "bank_transfer",
    loggedByAgentId: "agent-2",
    loggedAt: daysFromNow(-400),
    status: "paid",
    note: "Annual rent — year 1",
  },
  {
    id: "pay-8",
    tenancyId: "tenancy-4",
    amount: 25_000_000,
    dueDate: daysFromNow(40),
    paidDate: null,
    method: "bank_transfer",
    loggedByAgentId: "agent-2",
    loggedAt: daysFromNow(-360),
    status: "due",
    note: "Annual rent — year 2",
  },
];

const tenant5PaymentHistory: PaymentEntry[] = [
  {
    id: "pay-9",
    tenancyId: "tenancy-5",
    amount: 8_200_000,
    dueDate: daysFromNow(-200),
    paidDate: daysFromNow(-200),
    method: "bank_transfer",
    loggedByAgentId: "agent-1",
    loggedAt: daysFromNow(-200),
    status: "paid",
    note: "Security deposit",
  },
  {
    id: "pay-10",
    tenancyId: "tenancy-5",
    amount: 8_200_000,
    dueDate: daysFromNow(-5),
    paidDate: null,
    method: "bank_transfer",
    loggedByAgentId: "agent-1",
    loggedAt: daysFromNow(-35),
    status: "overdue",
    note: "Annual rent",
  },
];

const tenant6PaymentHistory: PaymentEntry[] = [
  {
    id: "pay-11",
    tenancyId: "tenancy-6",
    amount: 16_000_000,
    dueDate: daysFromNow(-300),
    paidDate: daysFromNow(-300),
    method: "bank_transfer",
    loggedByAgentId: "agent-2",
    loggedAt: daysFromNow(-300),
    status: "paid",
    note: "Security deposit",
  },
  {
    id: "pay-12",
    tenancyId: "tenancy-6",
    amount: 16_000_000,
    dueDate: daysFromNow(-295),
    paidDate: daysFromNow(-296),
    method: "bank_transfer",
    loggedByAgentId: "agent-2",
    loggedAt: daysFromNow(-295),
    status: "paid",
    note: "Annual rent — year 1",
  },
];

const tenant7PaymentHistory: PaymentEntry[] = [
  {
    id: "pay-13",
    tenancyId: "tenancy-7",
    amount: 7_500_000,
    dueDate: daysFromNow(-100),
    paidDate: daysFromNow(-100),
    method: "card",
    loggedByAgentId: "agent-2",
    loggedAt: daysFromNow(-100),
    status: "paid",
    note: "Security deposit",
  },
];

const tenant8PaymentHistory: PaymentEntry[] = [
  {
    id: "pay-14",
    tenancyId: "tenancy-8",
    amount: 10_500_000,
    dueDate: daysFromNow(-500),
    paidDate: daysFromNow(-500),
    method: "bank_transfer",
    loggedByAgentId: "agent-3",
    loggedAt: daysFromNow(-500),
    status: "paid",
    note: "Annual rent — year 1",
  },
  {
    id: "pay-15",
    tenancyId: "tenancy-8",
    amount: 10_500_000,
    dueDate: daysFromNow(15),
    paidDate: null,
    method: "bank_transfer",
    loggedByAgentId: "agent-3",
    loggedAt: daysFromNow(-15),
    status: "due",
    note: "Annual rent — year 2",
  },
];

const tenant9PaymentHistory: PaymentEntry[] = [
  {
    id: "pay-16",
    tenancyId: "tenancy-9",
    amount: 7_000_000,
    dueDate: daysFromNow(-50),
    paidDate: daysFromNow(-50),
    method: "cash",
    loggedByAgentId: "agent-3",
    loggedAt: daysFromNow(-50),
    status: "paid",
    note: "Security deposit",
  },
  {
    id: "pay-17",
    tenancyId: "tenancy-9",
    amount: 7_000_000,
    dueDate: daysFromNow(-2),
    paidDate: null,
    method: "bank_transfer",
    loggedByAgentId: "agent-3",
    loggedAt: daysFromNow(-32),
    status: "overdue",
    note: "Annual rent",
  },
];

export const tenancies: TenantPropertyRecord[] = [
  {
    id: "tenancy-1",
    tenantId: "tenant-1",
    propertyId: "prop-1",
    unit: "Penthouse A",
    leaseStart: daysFromNow(-620),
    nextDueDate: daysFromNow(23),
    paymentHistory: tenant1PaymentHistory,
  },
  {
    id: "tenancy-2",
    tenantId: "tenant-2",
    propertyId: "prop-3",
    unit: "Unit 3B",
    leaseStart: daysFromNow(-180),
    nextDueDate: daysFromNow(185),
    paymentHistory: tenant2PaymentHistory,
  },
  {
    id: "tenancy-3",
    tenantId: "tenant-3",
    propertyId: "prop-4",
    unit: "Flat 2",
    leaseStart: daysFromNow(-355),
    nextDueDate: daysFromNow(-10),
    paymentHistory: tenant3PaymentHistory,
  },
  {
    id: "tenancy-4",
    tenantId: "tenant-4",
    propertyId: "prop-2",
    unit: "Main House",
    leaseStart: daysFromNow(-400),
    nextDueDate: daysFromNow(40),
    paymentHistory: tenant4PaymentHistory,
  },
  {
    id: "tenancy-5",
    tenantId: "tenant-5",
    propertyId: "prop-6",
    unit: "Unit 1",
    leaseStart: daysFromNow(-200),
    nextDueDate: daysFromNow(-5),
    paymentHistory: tenant5PaymentHistory,
  },
  {
    id: "tenancy-6",
    tenantId: "tenant-6",
    propertyId: "prop-7",
    unit: "Main House",
    leaseStart: daysFromNow(-300),
    nextDueDate: daysFromNow(65),
    paymentHistory: tenant6PaymentHistory,
  },
  {
    id: "tenancy-7",
    tenantId: "tenant-7",
    propertyId: "prop-8",
    unit: "Unit 2B",
    leaseStart: daysFromNow(-100),
    nextDueDate: daysFromNow(265),
    paymentHistory: tenant7PaymentHistory,
  },
  {
    id: "tenancy-8",
    tenantId: "tenant-8",
    propertyId: "prop-10",
    unit: "Duplex A",
    leaseStart: daysFromNow(-500),
    nextDueDate: daysFromNow(15),
    paymentHistory: tenant8PaymentHistory,
  },
  {
    id: "tenancy-9",
    tenantId: "tenant-9",
    propertyId: "prop-11",
    unit: "Townhouse",
    leaseStart: daysFromNow(-50),
    nextDueDate: daysFromNow(-2),
    paymentHistory: tenant9PaymentHistory,
  },
];
