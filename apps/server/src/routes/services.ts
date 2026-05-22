import { Router } from "express";

import {
  getCatalogService,
  listCatalogServices,
  type CatalogService,
} from "../lib/catalog-services.js";

export type { CatalogService };

function sortServices(items: CatalogService[]): CatalogService[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

export const servicesRouter = Router();

servicesRouter.get("/", (_req, res) => {
  const items = sortServices(
    listCatalogServices().filter((s) => s.isAvailable),
  );
  res.json({ count: items.length, items });
});

servicesRouter.get("/:id", (req, res) => {
  const service = getCatalogService(req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found", id: req.params.id });
  }
  res.json(service);
});
