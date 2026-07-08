import type { Metadata } from "next";
import { KvarcsPortfolioPage } from "@/components/kvarcs-site";
import { getPublicMedia } from "@/lib/public-media";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Портфолио KVARC-S",
  description:
    "Галерея готовых работ KVARC-S: кварцевые столешницы, острова, стойки, ванные и коммерческие зоны в Ташкенте.",
  alternates: {
    canonical: "/portfolio"
  },
  openGraph: {
    title: "Портфолио KVARC-S",
    description:
      "Галерея готовых работ KVARC-S: кварцевые столешницы, острова, стойки, ванные и коммерческие зоны.",
    url: `${siteConfig.url}/portfolio`,
    siteName: siteConfig.name,
    type: "website"
  }
};

export default function PortfolioPage() {
  const images = getPublicMedia("portfolio");
  return <KvarcsPortfolioPage images={images} />;
}
