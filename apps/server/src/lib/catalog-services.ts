export type CatalogService = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  priceCents: number | null;
  currency: string;
  isAvailable: boolean;
  category?: string;
  sortOrder: number;
  metadata?: Record<string, string>;
};

export {
  ensureServicesSeeded,
  getFirestoreService as getCatalogService,
  listFirestoreServices as listCatalogServices,
} from "./firestore-services.js";
