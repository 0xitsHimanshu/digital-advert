import type { DocumentData } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import type { CatalogService } from "@/lib/types/admin";

const COLLECTION = "services";

function parseService(id: string, data: DocumentData): CatalogService | null {
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

export async function listServices(): Promise<CatalogService[]> {
  const snap = await getAdminFirestore().collection(COLLECTION).get();
  return snap.docs
    .map((doc) => parseService(doc.id, doc.data()))
    .filter((s): s is CatalogService => s !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getService(id: string): Promise<CatalogService | null> {
  const snap = await getAdminFirestore().collection(COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  return parseService(snap.id, snap.data() ?? {});
}

export async function upsertService(service: CatalogService): Promise<CatalogService> {
  await getAdminFirestore().collection(COLLECTION).doc(service.id).set(service, { merge: true });
  return service;
}

export async function deleteService(id: string): Promise<void> {
  await getAdminFirestore().collection(COLLECTION).doc(id).delete();
}
