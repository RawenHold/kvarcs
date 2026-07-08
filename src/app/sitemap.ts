import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteConfig.url}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/catalog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${siteConfig.url}/partners`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7
    }
  ];
}
