import { subDays, format } from "date-fns";

import { CART_ABANDONMENT_HOURS } from "@/lib/firebase/config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { AnalyticsSummary, PaymentOrderStatus } from "@/lib/types/admin";

import { listAbandonedCarts } from "./firestore-customers";
import { listCoupons } from "./firestore-coupons";

const ORDERS = "orders";

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const db = getAdminFirestore();
  const [customersSnap, ordersSnap, coupons] = await Promise.all([
    db.collection("customers").get(),
    db.collectionGroup(ORDERS).get(),
    listCoupons(),
  ]);

  const activeCutoff = subDays(new Date(), 30).toISOString();
  let activeUsers30d = 0;

  for (const doc of customersSnap.docs) {
    const lastActive =
      typeof doc.data().lastActiveAt === "string"
        ? doc.data().lastActiveAt
        : doc.data().updatedAt;
    if (typeof lastActive === "string" && lastActive >= activeCutoff) {
      activeUsers30d += 1;
    }
  }

  const ordersByStatus: Record<PaymentOrderStatus, number> = {
    CREATED: 0,
    PAYMENT_PENDING: 0,
    PAID: 0,
    PAYMENT_FAILED: 0,
  };

  let totalRevenueCents = 0;
  const serviceMap = new Map<
    string,
    { serviceId: string; title: string; quantity: number; revenueCents: number }
  >();
  const dayMap = new Map<string, { revenueCents: number; orderCount: number }>();

  for (const doc of ordersSnap.docs) {
    const data = doc.data();
    const status = (data.status as PaymentOrderStatus) ?? "PAYMENT_PENDING";
    if (status in ordersByStatus) {
      ordersByStatus[status] += 1;
    }

    if (status !== "PAID") continue;

    const amount = typeof data.amountCents === "number" ? data.amountCents : 0;
    totalRevenueCents += amount;

    const paidAt =
      typeof data.paidAt === "string"
        ? data.paidAt
        : typeof data.createdAt === "string"
          ? data.createdAt
          : new Date().toISOString();
    const dayKey = format(new Date(paidAt), "yyyy-MM-dd");
    const dayEntry = dayMap.get(dayKey) ?? { revenueCents: 0, orderCount: 0 };
    dayEntry.revenueCents += amount;
    dayEntry.orderCount += 1;
    dayMap.set(dayKey, dayEntry);

    if (Array.isArray(data.lines)) {
      for (const line of data.lines) {
        if (!line || typeof line.serviceId !== "string") continue;
        const qty = typeof line.quantity === "number" ? line.quantity : 1;
        const lineTotal =
          typeof line.lineTotalCents === "number" ? line.lineTotalCents : 0;
        const title = typeof line.title === "string" ? line.title : line.serviceId;
        const existing = serviceMap.get(line.serviceId) ?? {
          serviceId: line.serviceId,
          title,
          quantity: 0,
          revenueCents: 0,
        };
        existing.quantity += qty;
        existing.revenueCents += lineTotal;
        serviceMap.set(line.serviceId, existing);
      }
    }
  }

  const abandoned = await listAbandonedCarts(CART_ABANDONMENT_HOURS);
  const couponRedemptions = coupons.reduce((sum, c) => sum + c.usageCount, 0);

  const revenueByDay = [...dayMap.entries()]
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  const topServices = [...serviceMap.values()]
    .sort((a, b) => b.revenueCents - a.revenueCents)
    .slice(0, 8);

  return {
    totalUsers: customersSnap.size,
    activeUsers30d,
    totalRevenueCents,
    pendingCarts: abandoned.length,
    couponRedemptions,
    topServices,
    ordersByStatus,
    revenueByDay,
  };
}
