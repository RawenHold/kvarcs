import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Playfair_Display } from "next/font/google";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"]
});

const playfairDisplay = Playfair_Display({
  subsets: ["cyrillic", "latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "business",
  classification: "Quartz surfaces, countertops and stone processing in Uzbekistan",
  alternates: {
    canonical: "/"
  },
  manifest: "/manifest.webmanifest",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    address: false,
    email: false
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: 1200,
        height: 900,
        alt: "Каталог кварцевых плит KVARC-S"
      }
    ],
    locale: "ru_UZ",
    alternateLocale: ["uz_UZ"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.ogImage)]
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png"
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent"
  },
  other: {
    "geo.region": "UZ-TK",
    "geo.placename": "Tashkent",
    "geo.position": `${siteConfig.geo.latitude};${siteConfig.geo.longitude}`,
    ICBM: `${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D0F" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      data-theme="cloud"
      className={`${ibmPlexSans.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
