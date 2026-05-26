import { getFirestoreDb } from "./firestore-db.js";

const COLLECTION = "customer_carts";

export type CartSnapshotLine = {
  serviceId: string;
  quantity: number;
  title?: string;
  unitPriceCents?: number;
};

export async function upsertCustomerCartSnapshot(input: {
  customerId: string;
  lines: CartSnapshotLine[];
  currency: string;
  estimatedTotalCents: number;
  contactEmail?: string;
  contactPhone?: string;
}): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;

  await db.collection(COLLECTION).doc(input.customerId).set(
    {
      customerId: input.customerId,
      lines: input.lines,
      currency: input.currency,
      estimatedTotalCents: input.estimatedTotalCents,
      updatedAt: new Date().toISOString(),
      ...(input.contactEmail ? { contactEmail: input.contactEmail } : {}),
      ...(input.contactPhone ? { contactPhone: input.contactPhone } : {}),
    },
    { merge: true },
  );
}
