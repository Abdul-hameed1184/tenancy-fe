import type { Property, TenantPropertyRecord, User } from "@/types/entities";

export interface TenancyDetail extends TenantPropertyRecord {
  tenant: User;
  property: Property;
}
