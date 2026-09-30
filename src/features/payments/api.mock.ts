import { withLatency } from "@/lib/api/http";
import { db, genId } from "@/mocks/db";
import type { PaymentEntry } from "@/types/entities";

export function getPaymentHistory(tenancyId: string): Promise<PaymentEntry[]> {
  return withLatency(() => {
    const tenancy = db.tenancies.find((t) => t.id === tenancyId);
    if (!tenancy) throw new Error(`Tenancy ${tenancyId} not found`);
    return [...tenancy.paymentHistory].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
  });
}

export interface LogPaymentInput {
  amount: number;
  dueDate: string;
  paidDate: string | null;
  method: PaymentEntry["method"];
  status: PaymentEntry["status"];
  loggedByAgentId: string;
  note?: string;
}

/**
 * Append-only by design: there is no updatePayment/deletePayment. A tenancy's
 * payment history is a running ledger — the only way to change what a tenant
 * or landlord sees is to add a new entry, never edit or remove a past one.
 */
export function logPayment(tenancyId: string, input: LogPaymentInput): Promise<PaymentEntry> {
  return withLatency(() => {
    const tenancy = db.tenancies.find((t) => t.id === tenancyId);
    if (!tenancy) throw new Error(`Tenancy ${tenancyId} not found`);

    const entry: PaymentEntry = {
      id: genId("pay"),
      tenancyId,
      loggedAt: new Date().toISOString(),
      ...input,
    };
    tenancy.paymentHistory.push(entry);

    if (input.status === "paid") {
      const nextDue = new Date(input.dueDate);
      nextDue.setFullYear(nextDue.getFullYear() + 1);
      tenancy.nextDueDate = nextDue.toISOString();
    }

    return entry;
  });
}
