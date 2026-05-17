import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

type AdminState =
  | { status: "uninitialized" }
  | { status: "ready" }
  | { status: "error"; message: string };

let state: AdminState = { status: "uninitialized" };

function validateServiceAccount(parsed: unknown): ServiceAccount {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Service account JSON must be an object.");
  }

  const record = parsed as Record<string, unknown>;

  // google-services.json (mobile client config) is often pasted by mistake.
  if ("project_info" in record || "client" in record) {
    throw new Error(
      'This looks like google-services.json (mobile app config), not a Firebase Admin service account. In Firebase Console → Project settings → Service accounts → "Generate new private key", then set GOOGLE_APPLICATION_CREDENTIALS to that file path or paste that JSON into FIREBASE_SERVICE_ACCOUNT_JSON.',
    );
  }

  if (typeof record.project_id !== "string" || !record.project_id.trim()) {
    throw new Error(
      'Service account JSON must include a top-level string "project_id" (and "private_key", "client_email"). Download a service account key from Firebase Console → Project settings → Service accounts.',
    );
  }

  if (typeof record.private_key !== "string" || !record.private_key.trim()) {
    throw new Error('Service account JSON must include a "private_key" field.');
  }

  if (typeof record.client_email !== "string" || !record.client_email.trim()) {
    throw new Error('Service account JSON must include a "client_email" field.');
  }

  return parsed as ServiceAccount;
}

function tryInit(): AdminState {
  if (getApps().length > 0) {
    return { status: "ready" };
  }

  try {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    if (json) {
      const parsed = validateServiceAccount(JSON.parse(json));
      initializeApp({ credential: cert(parsed) });
      return { status: "ready" };
    }

    const adcPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
    if (adcPath) {
      initializeApp({ credential: applicationDefault() });
      return { status: "ready" };
    }

    return {
      status: "error",
      message:
        "Configure Firebase Admin: set FIREBASE_SERVICE_ACCOUNT_JSON to your service-account JSON string, or set GOOGLE_APPLICATION_CREDENTIALS to a credentials file path.",
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown Firebase init error";
    return { status: "error", message: `Firebase Admin failed to initialize: ${message}` };
  }
}

/** Returns null when Admin is usable, otherwise an error message. */
export function ensureFirebaseAdmin(): string | null {
  if (state.status === "ready") return null;
  if (state.status === "error") return state.message;

  state = tryInit();
  return state.status === "ready"
    ? null
    : state.status === "error"
      ? state.message
      : "Firebase Admin failed to initialize.";
}

export async function verifyFirebaseCustomerIdToken(idToken: string) {
  const err = ensureFirebaseAdmin();
  if (err) {
    throw new Error(err);
  }
  return getAuth().verifyIdToken(idToken);
}
