import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: "ru-UZ",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0D0D0F",
    theme_color: "#D4A15C",
    categories: ["business", "shopping", "home"],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ],
    shortcuts: [
      {
        name: "Каталог KVARC-S",
        short_name: "Каталог",
        description: "Кварцевые плиты KVARC-S",
        url: "/catalog",
        icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }]
      },
      {
        name: "Контакты KVARC-S",
        short_name: "Контакты",
        description: "Телефон, Telegram и адрес KVARC-S",
        url: "/#contacts",
        icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }]
      }
    ]
  };
}
