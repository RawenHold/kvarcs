import type { MetadataRoute } from "next";
import { stones } from "@/lib/catalog-data";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteConfig.url}/portfolio`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/catalog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...stones.map((stone) => ({
      url: `${siteConfig.url}/catalog/${stone.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75
    })),
    {
      url: `${siteConfig.url}/partners`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7
    }
  ];
}
