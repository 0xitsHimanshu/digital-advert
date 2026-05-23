import "dotenv/config";
import { createApp } from "./app.js";
import { ensureServicesSeeded } from "./lib/firestore-services.js";

const port = Number(process.env.PORT) || 4000;
const app = createApp();

void ensureServicesSeeded().catch((e) => {
  // eslint-disable-next-line no-console
  console.warn("[server] Firestore services seed skipped:", e);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${port}`);
});
