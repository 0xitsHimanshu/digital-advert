import { Router } from "express";

export type Ad = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaUrl: string;
  createdAt: string;
};

const ads: Ad[] = [
  {
    id: "ad_001",
    title: "Summer Sale - Up to 50% off",
    description: "Hottest deals of the season on premium gear.",
    imageUrl: "https://picsum.photos/seed/ad1/640/360",
    ctaUrl: "https://example.com/summer",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ad_002",
    title: "New Launch: Pro Headphones",
    description: "Studio-grade audio, all-day comfort.",
    imageUrl: "https://picsum.photos/seed/ad2/640/360",
    ctaUrl: "https://example.com/headphones",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ad_003",
    title: "Try Cloud Plus free for 30 days",
    description: "Faster sync, unlimited storage, zero setup.",
    imageUrl: "https://picsum.photos/seed/ad3/640/360",
    ctaUrl: "https://example.com/cloud",
    createdAt: new Date().toISOString(),
  },
];

export const adsRouter = Router();

adsRouter.get("/", (_req, res) => {
  res.json({ count: ads.length, items: ads });
});

adsRouter.get("/:id", (req, res) => {
  const ad = ads.find((a) => a.id === req.params.id);
  if (!ad) {
    return res.status(404).json({ error: "Ad not found", id: req.params.id });
  }
  res.json(ad);
});

adsRouter.post("/", (req, res) => {
  const { title, description, imageUrl, ctaUrl } = req.body ?? {};
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Missing required fields: title, description" });
  }
  const ad: Ad = {
    id: `ad_${String(ads.length + 1).padStart(3, "0")}`,
    title,
    description,
    imageUrl: imageUrl ?? "https://picsum.photos/seed/new/640/360",
    ctaUrl: ctaUrl ?? "https://example.com",
    createdAt: new Date().toISOString(),
  };
  ads.push(ad);
  res.status(201).json(ad);
});
