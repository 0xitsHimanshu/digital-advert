import axios from "axios";

import { apiClient } from "@/src/services/api-client";
import type { CatalogService, ServicesListResponse } from "@/src/types/service";

export function formatServicesApiError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as { message?: string; error?: string } | undefined;
    if (data?.message && typeof data.message === "string") return data.message;
    if (data?.error && typeof data.error === "string") return data.error;
    if (e.response == null) {
      return "Could not reach the server. Check your network and API base URL.";
    }
    return e.message;
  }
  if (e instanceof Error) return e.message;
  return "Could not load services.";
}

/** Fallback when the catalog API is unavailable (local dev / offline). */
export const MOCK_CATALOG_SERVICES: CatalogService[] = [
  {
    id: "mock_digital_marketing",
    title: "Digital Marketing",
    description:
      "Popular full-funnel campaigns, paid social, and performance reporting for your brand.",
    imageUrl: "https://picsum.photos/seed/mock-dm/406/368",
    priceCents: 49900,
    currency: "USD",
    isAvailable: true,
    category: "Marketing",
    sortOrder: 1,
  },
  {
    id: "mock_video_editing",
    title: "Video Editing",
    description: "Professional cuts, color grading, and motion graphics for social content.",
    imageUrl: "https://picsum.photos/seed/mock-ve/406/368",
    priceCents: 34900,
    currency: "USD",
    isAvailable: true,
    category: "Video",
    sortOrder: 2,
  },
  {
    id: "mock_brand_design",
    title: "Brand Design",
    description: "Logo systems, brand guidelines, and marketing assets that stay on-brand.",
    imageUrl: "https://picsum.photos/seed/mock-bd/406/368",
    priceCents: null,
    currency: "USD",
    isAvailable: true,
    category: "Design",
    sortOrder: 3,
  },
];

type ListOptions = {
  /** Use bundled mock catalog when the API is unreachable (dev / offline). */
  fallbackToMock?: boolean;
};

export async function listCatalogServices(options?: ListOptions): Promise<CatalogService[]> {
  try {
    const { data } = await apiClient.get<ServicesListResponse>("/api/services");
    return data.items ?? [];
  } catch (e) {
    if (options?.fallbackToMock) {
      return MOCK_CATALOG_SERVICES;
    }
    throw e;
  }
}

export async function getCatalogService(id: string): Promise<CatalogService | null> {
  try {
    const { data } = await apiClient.get<CatalogService>(`/api/services/${encodeURIComponent(id)}`);
    return data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return MOCK_CATALOG_SERVICES.find((s) => s.id === id) ?? null;
    }
    return MOCK_CATALOG_SERVICES.find((s) => s.id === id) ?? null;
  }
}
