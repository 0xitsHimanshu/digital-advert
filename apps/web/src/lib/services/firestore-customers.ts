import type { DocumentData } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import type {
  ActivityLog,
  CustomerCartSnapshot,
  CustomerProfile,
  PaymentOrder,
  UserListItem,
} from "@/lib/types/admin";

const CUSTOMERS = "customers";
const ORDERS = "orders";
const ACTIVITY = "activity_logs";
const CARTS = "customer_carts";

function parseProfile(uid: string, data: DocumentData): CustomerProfile | null {
  if (!data || typeof data.name !== "string") return null;
  return {
    uid,
    name: data.name,
    phoneNumber: typeof data.phoneNumber === "string" ? data.phoneNumber : "",
    email: typeof data.email === "string" ? data.email : undefined,
    address: typeof data.address === "string" ? data.address : undefined,
    avatarUrl: typeof data.avatarUrl === "string" ? data.avatarUrl : "",
    updatedAt:
      typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
    signupAt: typeof data.signupAt === "string" ? data.signupAt : undefined,
    lastActiveAt: typeof data.lastActiveAt === "string" ? data.lastActiveAt : undefined,
  };
}

function parseOrder(customerId: string, orderId: string, data: DocumentData): PaymentOrder | null {
  if (!data || typeof data.razorpayOrderId !== "string") return null;
  return {
    id: orderId,
    customerId: typeof data.customerId === "string" ? data.customerId : customerId,
    razorpayOrderId: data.razorpayOrderId,
    amountCents: typeof data.amountCents === "number" ? data.amountCents : 0,
    currency: typeof data.currency === "string" ? data.currency : "INR",
    status: (data.status as PaymentOrder["status"]) ?? "PAYMENT_PENDING",
    lines: Array.isArray(data.lines) ? data.lines : [],
    subtotalCents: typeof data.subtotalCents === "number" ? data.subtotalCents : 0,
    discountCents: typeof data.discountCents === "number" ? data.discountCents : 0,
    taxCents: typeof data.taxCents === "number" ? data.taxCents : 0,
    createdAt:
      typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    paidAt: typeof data.paidAt === "string" ? data.paidAt : undefined,
    razorpayPaymentId:
      typeof data.razorpayPaymentId === "string" ? data.razorpayPaymentId : undefined,
    paymentMethod: typeof data.paymentMethod === "string" ? data.paymentMethod : undefined,
    updates: Array.isArray(data.updates) ? data.updates : undefined,
    couponCode: typeof data.couponCode === "string" ? data.couponCode : undefined,
  };
}

export async function listCustomers(search?: string): Promise<UserListItem[]> {
  const db = getAdminFirestore();
  const snap = await db.collection(CUSTOMERS).get();
  const q = search?.trim().toLowerCase();

  const items: UserListItem[] = [];

  for (const doc of snap.docs) {
    const profile = parseProfile(doc.id, doc.data());
    if (!profile) continue;

    if (q) {
      const haystack = [profile.name, profile.email, profile.phoneNumber, profile.uid]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) continue;
    }

    const [ordersSnap, cartSnap, activitySnap] = await Promise.all([
      doc.ref.collection(ORDERS).where("status", "==", "PAID").get(),
      db.collection(CARTS).doc(doc.id).get(),
      doc.ref.collection(ACTIVITY).orderBy("createdAt", "desc").limit(50).get(),
    ]);

    let totalSpentCents = 0;
    let lastOrderAt: string | undefined;
    for (const orderDoc of ordersSnap.docs) {
      const order = parseOrder(doc.id, orderDoc.id, orderDoc.data());
      if (!order) continue;
      totalSpentCents += order.amountCents;
      const ts = order.paidAt ?? order.createdAt;
      if (!lastOrderAt || ts > lastOrderAt) lastOrderAt = ts;
    }

    const cartData = cartSnap.data();
    const cartItemCount = Array.isArray(cartData?.lines) ? cartData.lines.length : 0;

    items.push({
      ...profile,
      orderCount: ordersSnap.size,
      totalSpentCents,
      lastOrderAt,
      cartItemCount,
      activityCount: activitySnap.size,
    });
  }

  return items.sort((a, b) => {
    const aTime = a.lastActiveAt ?? a.updatedAt;
    const bTime = b.lastActiveAt ?? b.updatedAt;
    return bTime.localeCompare(aTime);
  });
}

export async function getCustomerDetail(uid: string) {
  const db = getAdminFirestore();
  const doc = await db.collection(CUSTOMERS).doc(uid).get();
  if (!doc.exists) return null;

  const profile = parseProfile(uid, doc.data() ?? {});
  if (!profile) return null;

  const [ordersSnap, cartSnap, activitySnap] = await Promise.all([
    doc.ref.collection(ORDERS).get(),
    db.collection(CARTS).doc(uid).get(),
    doc.ref.collection(ACTIVITY).orderBy("createdAt", "desc").limit(100).get(),
  ]);

  const orders = ordersSnap.docs
    .map((d) => parseOrder(uid, d.id, d.data()))
    .filter((o): o is PaymentOrder => o !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const cart = cartSnap.exists ? parseCart(uid, cartSnap.data() ?? {}) : null;

  const activityLogs: ActivityLog[] = activitySnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      customerId: uid,
      type: typeof data.type === "string" ? data.type : "event",
      label: typeof data.label === "string" ? data.label : "",
      metadata:
        data.metadata && typeof data.metadata === "object"
          ? (data.metadata as Record<string, unknown>)
          : undefined,
      createdAt:
        typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    };
  });

  const paidOrders = orders.filter((o) => o.status === "PAID");
  const totalSpentCents = paidOrders.reduce((sum, o) => sum + o.amountCents, 0);

  return {
    profile,
    orders,
    cart,
    activityLogs,
    summary: {
      orderCount: paidOrders.length,
      totalSpentCents,
      cartItemCount: cart?.lines.length ?? 0,
    },
  };
}

function parseCart(customerId: string, data: DocumentData): CustomerCartSnapshot | null {
  if (!Array.isArray(data.lines)) return null;
  return {
    customerId,
    lines: data.lines,
    currency: typeof data.currency === "string" ? data.currency : "INR",
    estimatedTotalCents:
      typeof data.estimatedTotalCents === "number" ? data.estimatedTotalCents : 0,
    updatedAt:
      typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
    contactEmail: typeof data.contactEmail === "string" ? data.contactEmail : undefined,
    contactPhone: typeof data.contactPhone === "string" ? data.contactPhone : undefined,
  };
}

export async function listAbandonedCarts(abandonmentHours: number) {
  const db = getAdminFirestore();
  const cutoff = new Date(Date.now() - abandonmentHours * 60 * 60 * 1000).toISOString();
  const snap = await db.collection(CARTS).get();
  const results: Array<CustomerCartSnapshot & { profile: CustomerProfile | null }> = [];

  for (const doc of snap.docs) {
    const cart = parseCart(doc.id, doc.data());
    if (!cart || !cart.lines.length) continue;
    if (cart.updatedAt > cutoff) continue;

    const profileSnap = await db.collection(CUSTOMERS).doc(doc.id).get();
    const profile = profileSnap.exists
      ? parseProfile(doc.id, profileSnap.data() ?? {})
      : null;

    results.push({ ...cart, profile });
  }

  return results.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
}
