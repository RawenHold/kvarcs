import type { Metadata } from "next";
import { KvarcsPartnersPage } from "@/components/kvarcs-site";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Обработчики камня KVARC-S",
  description:
    "Каталог партнёров KVARC-S по обработке камня: контакты обработчиков для замера, изготовления, доставки и монтажа.",
  alternates: {
    canonical: "/partners"
  },
  openGraph: {
    title: "Обработчики камня KVARC-S",
    description: "Контакты партнёров KVARC-S по обработке и монтажу кварцевого агломерата.",
    url: `${siteConfig.url}/partners`,
    siteName: siteConfig.name,
    type: "website"
  }
};

export default function PartnersPage() {
  return <KvarcsPartnersPage />;
}
