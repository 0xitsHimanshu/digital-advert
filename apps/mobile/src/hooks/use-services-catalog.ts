import { useCallback, useEffect, useMemo, useState } from "react";

import { useDebouncedValue } from "@/src/hooks/use-debounced-value";
import { filterServicesByQuery } from "@/src/lib/filter-services";
import { formatServicesApiError, listCatalogServices } from "@/src/services/services-api";
import type { CatalogService } from "@/src/types/service";

type LoadStatus = "idle" | "loading" | "ready" | "error";

export function useServicesCatalog(searchQuery: string, debounceMs = 300) {
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<CatalogService[]>([]);
  const debouncedQuery = useDebouncedValue(searchQuery, debounceMs);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const items = await listCatalogServices({ fallbackToMock: true });
      setServices(items);
      setStatus("ready");
    } catch (e) {
      setError(formatServicesApiError(e));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredServices = useMemo(
    () => filterServicesByQuery(services, debouncedQuery),
    [services, debouncedQuery],
  );

  const isSearching = debouncedQuery.trim().length > 0;

  return {
    services: filteredServices,
    totalCount: services.length,
    status,
    error,
    isSearching,
    refetch: load,
  };
}
