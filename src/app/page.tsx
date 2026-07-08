import { KvarcsSite } from "@/components/kvarcs-site";
import { stones } from "@/lib/catalog-data";
import { getPublicMedia } from "@/lib/public-media";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

function getStructuredData() {
  const organizationId = `${siteConfig.url}/#organization`;
  const websiteId = `${siteConfig.url}/#website`;
  const webpageId = `${siteConfig.url}/#webpage`;
  const catalogId = `${siteConfig.url}/catalog#catalog`;
  const breadcrumbId = `${siteConfig.url}/#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": organizationId,
        name: siteConfig.name,
        legalName: siteConfig.name,
        url: siteConfig.url,
        logo: absoluteUrl("/icon.png"),
        image: absoluteUrl(siteConfig.ogImage),
        description: siteConfig.description,
        foundingDate: siteConfig.foundedYear,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address.streetAddress,
          addressLocality: siteConfig.address.addressLocality,
          addressRegion: siteConfig.address.addressRegion,
          addressCountry: siteConfig.address.addressCountry
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: siteConfig.geo.latitude,
          longitude: siteConfig.geo.longitude
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "20:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday", "Sunday"],
            opens: "10:00",
            closes: "19:00"
          }
        ],
        areaServed: {
          "@type": "Country",
          name: "Uzbekistan"
        },
        sameAs: [siteConfig.telegram, siteConfig.instagram],
        knowsAbout: [
          "кварцевый агломерат",
          "кварцевые плиты",
          "столешницы из кварца",
          "барные стойки",
          "обработка камня"
        ]
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: ["ru-UZ", "uz-UZ"],
        publisher: {
          "@id": organizationId
        }
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: siteConfig.url,
        name: siteConfig.title,
        description: siteConfig.description,
        inLanguage: "ru-UZ",
        isPartOf: {
          "@id": websiteId
        },
        about: {
          "@id": organizationId
        },
        mainEntity: {
          "@id": catalogId
        },
        breadcrumb: {
          "@id": breadcrumbId
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: absoluteUrl(siteConfig.ogImage)
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: siteConfig.url
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": catalogId,
        name: "Каталог кварцевых плит KVARC-S",
        numberOfItems: stones.length,
        itemListElement: stones.map((stone, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            "@id": `${siteConfig.url}/catalog#product-${stone.slug}`,
            name: `KVARC-S ${stone.name}`,
            image: absoluteUrl(stone.detailImages?.[0] ?? stone.image),
            description: stone.description.ru,
            brand: {
              "@type": "Brand",
              name: siteConfig.name
            },
            material: "Кварцевый агломерат",
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Размер плиты",
                value: `${stone.specs.widthMm} x ${stone.specs.heightMm} мм`
              },
              {
                "@type": "PropertyValue",
                name: "Толщина",
                value: `${stone.specs.thicknessMm} мм`
              },
              {
                "@type": "PropertyValue",
                name: "Площадь плиты",
                value: `${stone.specs.areaM2} м2`
              },
              {
                "@type": "PropertyValue",
                name: "Поверхность",
                value: stone.surface.ru
              }
            ]
          }
        }))
      }
    ]
  };
}

function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function Home() {
  const portfolioImages = getPublicMedia("portfolio").slice(0, 30);
  const certificateImages = getPublicMedia("certificates");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(getStructuredData()) }}
      />
      <KvarcsSite portfolioImages={portfolioImages} certificateImages={certificateImages} />
    </>
  );
}
