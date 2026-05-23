import type { DocumentData } from "firebase-admin/firestore";

import { CATALOG_SEED_SERVICES } from "./catalog-seed.js";
import type { CatalogService } from "./catalog-services.js";
import { getFirestoreDb, requireFirestoreDb } from "./firestore-db.js";

const SERVICES_COLLECTION = "services";

function parseServiceDoc(id: string, data: DocumentData): CatalogService | null {
  if (!data || typeof data.title !== "string") return null;

  return {
    id,
    title: data.title,
    description: typeof data.description === "string" ? data.description : "",
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
    priceCents:
      typeof data.priceCents === "number"
        ? data.priceCents
        : data.priceCents === null
          ? null
          : null,
    currency: typeof data.currency === "string" ? data.currency : "INR",
    isAvailable: data.isAvailable !== false,
    category: typeof data.category === "string" ? data.category : undefined,
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
    metadata:
      data.metadata && typeof data.metadata === "object"
        ? (data.metadata as Record<string, string>)
        : undefined,
  };
}

/** Seeds `services` from catalog defaults when the collection has no documents. */
export async function ensureServicesSeeded(): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;

  const col = db.collection(SERVICES_COLLECTION);
  const existing = await col.limit(1).get();
  if (!existing.empty) return;

  const batch = db.batch();
  for (const service of CATALOG_SEED_SERVICES) {
    batch.set(col.doc(service.id), service);
  }
  await batch.commit();
}

export async function listFirestoreServices(): Promise<CatalogService[]> {
  const db = getFirestoreDb();
  if (!db) {
    return [...CATALOG_SEED_SERVICES].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  await ensureServicesSeeded();
  const snap = await db.collection(SERVICES_COLLECTION).get();
  const items = snap.docs
    .map((doc) => parseServiceDoc(doc.id, doc.data()))
    .filter((s): s is CatalogService => s !== null);

  return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getFirestoreService(id: string): Promise<CatalogService | undefined> {
  const db = getFirestoreDb();
  if (!db) {
    return CATALOG_SEED_SERVICES.find((s) => s.id === id);
  }

  await ensureServicesSeeded();
  const snap = await db.collection(SERVICES_COLLECTION).doc(id).get();
  if (!snap.exists) return undefined;
  return parseServiceDoc(snap.id, snap.data() ?? {}) ?? undefined;
}

/** Admin write — upsert a service document by id. */
export async function upsertFirestoreService(service: CatalogService): Promise<void> {
  const db = requireFirestoreDb();
  await db.collection(SERVICES_COLLECTION).doc(service.id).set(service, { merge: true });
}
