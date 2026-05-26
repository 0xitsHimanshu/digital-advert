import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function validateServiceAccount(parsed: unknown): ServiceAccount {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Service account JSON must be an object.");
  }
  const record = parsed as Record<string, unknown>;
  if (typeof record.project_id !== "string" || !record.project_id.trim()) {
    throw new Error('Service account JSON must include "project_id".');
  }
  if (typeof record.private_key !== "string" || !record.private_key.trim()) {
    throw new Error('Service account JSON must include "private_key".');
  }
  if (typeof record.client_email !== "string" || !record.client_email.trim()) {
    throw new Error('Service account JSON must include "client_email".');
  }
  return parsed as ServiceAccount;
}

function initAdminApp() {
  if (getApps().length > 0) return;

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    initializeApp({ credential: cert(validateServiceAccount(JSON.parse(json))) });
    return;
  }

  const adcPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (adcPath) {
    initializeApp({ credential: applicationDefault() });
    return;
  }

  throw new Error(
    "Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.",
  );
}

export function getAdminAuth() {
  initAdminApp();
  return getAuth();
}

export function getAdminFirestore() {
  initAdminApp();
  return getFirestore();
}
