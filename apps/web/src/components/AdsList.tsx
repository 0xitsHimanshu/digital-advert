"use client";

import { useEffect, useState } from "react";
import { api, type Ad, API_BASE_URL } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

export function AdsList() {
  const [status, setStatus] = useState<Status>("idle");
  const [ads, setAds] = useState<Ad[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.listAds();
      setAds(res.items);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="w-full max-w-3xl mx-auto p-6">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Ads from API
          </h2>
          <p className="text-sm text-zinc-500">Source: {API_BASE_URL}/api/ads</p>
        </div>
        <button
          onClick={load}
          className="rounded-full bg-foreground px-4 py-2 text-sm text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Refresh
        </button>
      </header>

      {status === "loading" && <p className="text-zinc-500">Loading…</p>}
      {status === "error" && (
        <p className="text-red-600 text-sm">
          Failed to load: {error}. Is the server running on {API_BASE_URL}?
        </p>
      )}
      {status === "success" && (
        <ul className="grid gap-4">
          {ads.map((ad) => (
            <li
              key={ad.id}
              className="rounded-lg border border-black/[.08] dark:border-white/[.145] p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium">{ad.title}</h3>
                <span className="text-xs text-zinc-500">{ad.id}</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {ad.description}
              </p>
              <a
                href={ad.ctaUrl}
                className="text-sm font-medium underline mt-2 inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more →
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
