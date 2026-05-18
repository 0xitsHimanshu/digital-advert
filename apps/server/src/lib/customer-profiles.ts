import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { ensureFirebaseAdmin } from "./firebase-admin.js";

export type CustomerProfile = {
  uid: string;
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  avatarUrl: string;
  updatedAt: string;
};

const COLLECTION = "customers";

function firestoreOrNull(): Firestore | null {
  if (ensureFirebaseAdmin()) return null;
  return getFirestore();
}

export function isProfileComplete(profile: CustomerProfile | null): boolean {
  return Boolean(profile?.name?.trim());
}

export async function getCustomerProfile(
  uid: string,
): Promise<CustomerProfile | null> {
  const db = firestoreOrNull();
  if (!db) return null;

  const snap = await db.collection(COLLECTION).doc(uid).get();
  if (!snap.exists) return null;
  const data = snap.data();
  if (!data || typeof data.name !== "string") return null;

  return {
    uid,
    name: data.name,
    phoneNumber: typeof data.phoneNumber === "string" ? data.phoneNumber : "",
    email: typeof data.email === "string" ? data.email : undefined,
    address: typeof data.address === "string" ? data.address : undefined,
    avatarUrl: typeof data.avatarUrl === "string" ? data.avatarUrl : "",
    updatedAt:
      typeof data.updatedAt === "string"
        ? data.updatedAt
        : new Date().toISOString(),
  };
}

export type UpsertCustomerProfileInput = {
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  avatarUrl: string;
};

export async function upsertCustomerProfile(
  uid: string,
  input: UpsertCustomerProfileInput,
): Promise<CustomerProfile> {
  const db = firestoreOrNull();
  if (!db) {
    throw new Error("Firebase Admin is not configured for profile storage.");
  }

  const updatedAt = new Date().toISOString();
  const doc: CustomerProfile = {
    uid,
    name: input.name.trim(),
    phoneNumber: input.phoneNumber,
    avatarUrl: input.avatarUrl,
    updatedAt,
    ...(input.email?.trim() ? { email: input.email.trim() } : {}),
    ...(input.address?.trim() ? { address: input.address.trim() } : {}),
  };

  await db.collection(COLLECTION).doc(uid).set(doc, { merge: true });
  return doc;
}
