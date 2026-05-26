import { getFirestore, type Firestore } from "firebase-admin/firestore";

import { ensureFirebaseAdmin } from "./firebase-admin.js";

/** Returns Firestore when Admin is configured; otherwise null. */
let settingsApplied = false;

export function getFirestoreDb(): Firestore | null {
  if (ensureFirebaseAdmin()) return null;
  const db = getFirestore();
  if (!settingsApplied) {
    db.settings({ ignoreUndefinedProperties: true });
    settingsApplied = true;
  }
  return db;
}

export function requireFirestoreDb(): Firestore {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.",
    );
  }
  return db;
}
