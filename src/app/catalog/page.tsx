import type { Metadata } from "next";
import { KvarcsCatalogPage } from "@/components/kvarcs-site";
import { getPublicMedia } from "@/lib/public-media";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Каталог кварцевых плит KVARC-S",
  description:
    "Каталог кварцевого агломерата KVARC-S: 30 фактур плит для кухни, ванной, подоконников, стоек и коммерческих зон.",
  alternates: {
    canonical: "/catalog"
  },
  openGraph: {
    title: "Каталог кварцевых плит KVARC-S",
    description: "30 фактур кварцевого агломерата KVARC-S для жилых и коммерческих поверхностей.",
    url: `${siteConfig.url}/catalog`,
    siteName: siteConfig.name,
    type: "website"
  }
};

export default function CatalogPage() {
  const certificateImages = getPublicMedia("certificates");
  return <KvarcsCatalogPage certificateImages={certificateImages} />;
}
