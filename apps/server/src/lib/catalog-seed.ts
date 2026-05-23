import type { CatalogService } from "./catalog-services.js";

/** Default catalog written to Firestore when the services collection is empty. */
export const CATALOG_SEED_SERVICES: CatalogService[] = [
  {
    id: "svc_digital_marketing",
    title: "Digital Marketing",
    description:
      "Full-funnel campaigns, paid social, and performance reporting tailored to your brand.",
    imageUrl: "https://picsum.photos/seed/dm-catalog/406/368",
    priceCents: 49900,
    currency: "INR",
    isAvailable: true,
    category: "Marketing",
    sortOrder: 1,
  },
  {
    id: "svc_video_editing",
    title: "Video Editing",
    description:
      "Professional cuts, color grading, and motion graphics for ads and social content.",
    imageUrl: "https://picsum.photos/seed/ve-catalog/406/368",
    priceCents: 34900,
    currency: "INR",
    isAvailable: true,
    category: "Video",
    sortOrder: 2,
  },
  {
    id: "svc_brand_design",
    title: "Brand Design",
    description:
      "Logo systems, brand guidelines, and marketing assets that stay on-brand everywhere.",
    imageUrl: "https://picsum.photos/seed/bd-catalog/406/368",
    priceCents: null,
    currency: "INR",
    isAvailable: true,
    category: "Design",
    sortOrder: 3,
  },
  {
    id: "svc_seo",
    title: "SEO & Content",
    description:
      "Keyword strategy, on-page optimization, and content calendars that drive organic growth.",
    imageUrl: "https://picsum.photos/seed/seo-catalog/406/368",
    priceCents: 29900,
    currency: "INR",
    isAvailable: true,
    category: "Marketing",
    sortOrder: 4,
  },
  {
    id: "svc_social_media",
    title: "Social Media Management",
    description:
      "Channel planning, creative production, and community engagement across platforms.",
    imageUrl: "https://picsum.photos/seed/sm-catalog/406/368",
    priceCents: 19900,
    currency: "INR",
    isAvailable: true,
    category: "Marketing",
    sortOrder: 5,
  },
  {
    id: "svc_web_dev",
    title: "Web Development",
    description:
      "Landing pages and marketing sites optimized for conversion and Core Web Vitals.",
    imageUrl: "https://picsum.photos/seed/web-catalog/406/368",
    priceCents: 89900,
    currency: "INR",
    isAvailable: false,
    category: "Development",
    sortOrder: 6,
    metadata: { statusLabel: "Coming soon" },
  },
];
