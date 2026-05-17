import fs from "node:fs";
import path from "node:path";

import type { ExpoConfig } from "expo/config";

const ANDROID_GS = path.join(__dirname, "google-services.json");
const IOS_GS = path.join(__dirname, "GoogleService-Info.plist");

// Read app.json via fs instead of `import ... from "./app.json"` so this works
// on Node >= 22 / ESM, which now requires `with { type: "json" }` for JSON imports.
const appJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "app.json"), "utf-8"),
) as { expo: ExpoConfig };

const base = appJson.expo;

/** Adds google-services references only when the files exist so clones build before Firebase files are added. */
const config: { expo: ExpoConfig } = {
  expo: {
    ...base,
    ios: {
      ...base.ios,
      ...(fs.existsSync(IOS_GS)
        ? { googleServicesFile: "./GoogleService-Info.plist" }
        : {}),
    },
    android: {
      ...base.android,
      ...(fs.existsSync(ANDROID_GS)
        ? { googleServicesFile: "./google-services.json" }
        : {}),
    },
  },
};

export default config;
