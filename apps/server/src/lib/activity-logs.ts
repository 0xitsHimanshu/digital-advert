import { randomUUID } from "node:crypto";

import { getFirestoreDb } from "./firestore-db.js";

export async function appendActivityLog(
  customerId: string,
  entry: { type: string; label: string; metadata?: Record<string, unknown> },
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;

  const now = new Date().toISOString();
  await db
    .collection("customers")
    .doc(customerId)
    .collection("activity_logs")
    .doc(randomUUID())
    .set({
      type: entry.type,
      label: entry.label,
      metadata: entry.metadata ?? {},
      createdAt: now,
    });

  await db.collection("customers").doc(customerId).set(
    { lastActiveAt: now },
    { merge: true },
  );
}
