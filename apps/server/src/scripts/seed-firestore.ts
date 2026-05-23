/**
 * Seeds Firestore services from the built-in catalog.
 * Run: bun run --cwd apps/server seed:firestore
 */
import "dotenv/config";

import { ensureServicesSeeded } from "../lib/firestore-services.js";
import { ensureFirebaseAdmin } from "../lib/firebase-admin.js";

async function main() {
  const err = ensureFirebaseAdmin();
  if (err) {
    console.error("[seed] Firebase Admin not configured:", err);
    process.exit(1);
  }

  await ensureServicesSeeded();
  console.log("[seed] Firestore services collection is ready.");
}

main().catch((e) => {
  console.error("[seed] failed:", e);
  process.exit(1);
});
