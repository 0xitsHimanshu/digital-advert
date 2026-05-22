import type { CatalogService } from "@/src/types/service";

export type CartLine = {
  serviceId: string;
  quantity: number;
  service: CatalogService;
};
