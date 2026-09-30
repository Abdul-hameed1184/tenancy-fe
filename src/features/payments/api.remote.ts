import { http } from "@/lib/api/http";
import type { PaymentEntry } from "@/types/entities";
import type { LogPaymentInput } from "./api.mock";

export const getPaymentHistory = (tenancyId: string) =>
  http.get<PaymentEntry[]>(`/tenancies/${tenancyId}/payments`);

export const logPayment = (tenancyId: string, input: LogPaymentInput) =>
  http.post<PaymentEntry>(`/tenancies/${tenancyId}/payments`, input);
