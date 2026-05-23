import { randomUUID } from "node:crypto";

import { getCustomerProfile } from "./customer-profiles.js";
import type { OrderUpdate } from "./firestore-orders.js";

export function buildDefaultOrderUpdates(phoneNumber: string | undefined): OrderUpdate[] {
  const now = new Date().toISOString();
  const updates: OrderUpdate[] = [
    {
      id: randomUUID(),
      title: "Payment confirmed",
      label: "Status",
      value: "Your order is confirmed and being processed.",
      createdAt: now,
    },
  ];

  if (phoneNumber?.trim()) {
    updates.unshift({
      id: randomUUID(),
      title: "Updates sent to",
      label: "Call",
      value: phoneNumber.trim(),
      createdAt: now,
    });
  }

  return updates;
}

export async function resolveOrderUpdatesForCustomer(
  customerId: string,
  existing: OrderUpdate[] | undefined,
): Promise<OrderUpdate[]> {
  if (existing?.length) return existing;

  const profile = await getCustomerProfile(customerId);
  return buildDefaultOrderUpdates(profile?.phoneNumber);
}
