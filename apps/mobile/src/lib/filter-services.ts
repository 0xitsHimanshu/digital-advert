import type { CatalogService } from "@/src/types/service";

/** Case-insensitive match on title and description. */
export function filterServicesByQuery(
  services: CatalogService[],
  query: string,
): CatalogService[] {
  const q = query.trim().toLowerCase();
  if (!q) return services;

  return services.filter((service) => {
    const title = service.title.toLowerCase();
    const description = service.description.toLowerCase();
    return title.includes(q) || description.includes(q);
  });
}
