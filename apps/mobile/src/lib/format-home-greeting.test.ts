import { describe, expect, it } from "vitest";

import { formatHomeGreeting } from "@/src/lib/format-home-greeting";

describe("formatHomeGreeting", () => {
  it("uses the first name in lowercase", () => {
    expect(formatHomeGreeting("Rahul Sharma")).toBe("hey! rahul");
  });

  it("falls back when name is missing", () => {
    expect(formatHomeGreeting(null)).toBe("hey!");
  });
});
