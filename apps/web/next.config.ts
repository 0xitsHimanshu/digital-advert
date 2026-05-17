import path from "node:path";

import type { NextConfig } from "next";

// In a monorepo, Next.js 16 can't reliably infer the workspace root and
// emits "Next.js inferred your workspace root, but it may not be correct"
// when running through Turbopack. Pin it explicitly to the repo root.
const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
};

export default nextConfig;
