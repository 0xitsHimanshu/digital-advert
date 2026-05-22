export type CatalogService = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  priceCents: number | null;
  currency: string;
  isAvailable: boolean;
  category?: string;
  sortOrder?: number;
  metadata?: Record<string, string>;
};

export type ServicesListResponse = {
  count: number;
  items: CatalogService[];
};
