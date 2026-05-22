import { describe, expect, it } from "vitest";

import { filterServicesByQuery } from "@/src/lib/filter-services";
import type { CatalogService } from "@/src/types/service";

const sample: CatalogService[] = [
  {
    id: "1",
    title: "Digital Marketing",
    description: "Campaigns and ads",
    imageUrl: "",
    priceCents: null,
    currency: "USD",
    isAvailable: true,
  },
  {
    id: "2",
    title: "Video Editing",
    description: "Cuts and color",
    imageUrl: "",
    priceCents: null,
    currency: "USD",
    isAvailable: true,
  },
];

describe("filterServicesByQuery", () => {
  it("returns all services when query is empty", () => {
    expect(filterServicesByQuery(sample, "")).toEqual(sample);
    expect(filterServicesByQuery(sample, "   ")).toEqual(sample);
  });

  it("filters by title", () => {
    expect(filterServicesByQuery(sample, "video")).toHaveLength(1);
    expect(filterServicesByQuery(sample, "video")[0]?.id).toBe("2");
  });

  it("filters by description", () => {
    expect(filterServicesByQuery(sample, "color")).toHaveLength(1);
  });

  it("is case insensitive", () => {
    expect(filterServicesByQuery(sample, "DIGITAL")).toHaveLength(1);
  });
});
