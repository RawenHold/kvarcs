import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Phone, Send } from "lucide-react";
import { stones } from "@/lib/catalog-data";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { telHref } from "@/lib/utils";

type CatalogItemPageProps = {
  params: {
    slug: string;
  };
};

function getStone(slug: string) {
  return stones.find((stone) => stone.slug === slug);
}

function stoneTitle(stone: (typeof stones)[number]) {
  return `KVARC-S #${stone.number} ${stone.name} - кварцевая плита в Ташкенте`;
}

function stoneDescription(stone: (typeof stones)[number]) {
  return `${stone.name}: кварцевая плита KVARC-S ${stone.specs.thicknessMm} мм для столешниц, островов, подоконников, ванной и коммерческих зон. Доставка и подбор обработчика в Ташкенте.`;
}

function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function generateStaticParams() {
  return stones.map((stone) => ({
    slug: stone.slug
  }));
}

export function generateMetadata({ params }: CatalogItemPageProps): Metadata {
  const stone = getStone(params.slug);

  if (!stone) {
    return {};
  }

  const title = stoneTitle(stone);
  const description = stoneDescription(stone);
  const url = `/catalog/${stone.slug}`;
  const image = absoluteUrl(stone.detailImages?.[0] ?? stone.image);

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(url),
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          alt: `Кварцевая плита KVARC-S #${stone.number} ${stone.name}`
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export default function CatalogItemPage({ params }: CatalogItemPageProps) {
  const stone = getStone(params.slug);

  if (!stone) {
    notFound();
  }

  const pageUrl = absoluteUrl(`/catalog/${stone.slug}`);
  const image = stone.detailImages?.[0] ?? stone.image;
  const productId = `${pageUrl}#product`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: siteConfig.url
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Каталог",
            item: absoluteUrl("/catalog")
          },
          {
            "@type": "ListItem",
            position: 3,
            name: stone.name,
            item: pageUrl
          }
        ]
      },
      {
        "@type": "Product",
        "@id": productId,
        name: `KVARC-S #${stone.number} ${stone.name}`,
        image: absoluteUrl(image),
        description: stone.description.ru,
        brand: {
          "@type": "Brand",
          name: siteConfig.name
        },
        material: "Кварцевый агломерат",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Ширина",
            value: `${stone.specs.widthMm} мм`
          },
          {
            "@type": "PropertyValue",
            name: "Высота",
            value: `${stone.specs.heightMm} мм`
          },
          {
            "@type": "PropertyValue",
            name: "Толщина",
            value: `${stone.specs.thicknessMm} мм`
          },
          {
            "@type": "PropertyValue",
            name: "Площадь плиты",
            value: `${stone.specs.areaM2} м²`
          },
          {
            "@type": "PropertyValue",
            name: "Поверхность",
            value: stone.surface.ru
          }
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <div className="mx-auto max-w-6xl">
        <Link
          className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-extrabold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/catalog"
        >
          <ArrowLeft size={17} />
          Назад в каталог
        </Link>

        <section className="mt-6 grid overflow-hidden rounded-stone border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)] lg:grid-cols-[0.95fr_1fr]">
          <div className="relative min-h-[320px] bg-[var(--bg-primary)] md:min-h-[560px]">
            <Image
              src={image}
              alt={`Кварцевая плита KVARC-S #${stone.number} ${stone.name}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              quality={84}
            />
          </div>

          <div className="p-6 md:p-10">
            <p className="eyebrow">Quartz agglomerate</p>
            <h1 className="display-title mt-4 text-4xl leading-tight md:text-6xl">
              {stone.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
              {stone.description.ru}
            </p>

            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-stone border border-[var(--border)] p-4">
                <dt className="eyebrow text-[var(--text-muted)]">Ширина</dt>
                <dd className="mt-2 text-xl font-extrabold">{stone.specs.widthMm} мм</dd>
              </div>
              <div className="rounded-stone border border-[var(--border)] p-4">
                <dt className="eyebrow text-[var(--text-muted)]">Высота</dt>
                <dd className="mt-2 text-xl font-extrabold">{stone.specs.heightMm} мм</dd>
              </div>
              <div className="rounded-stone border border-[var(--border)] p-4">
                <dt className="eyebrow text-[var(--text-muted)]">Толщина</dt>
                <dd className="mt-2 text-xl font-extrabold">{stone.specs.thicknessMm} мм</dd>
              </div>
              <div className="rounded-stone border border-[var(--border)] p-4">
                <dt className="eyebrow text-[var(--text-muted)]">м² в плите</dt>
                <dd className="mt-2 text-xl font-extrabold">{stone.specs.areaM2} м²</dd>
              </div>
              <div className="rounded-stone border border-[var(--border)] p-4 sm:col-span-2">
                <dt className="eyebrow text-[var(--text-muted)]">Поверхность</dt>
                <dd className="mt-2 text-xl font-extrabold">{stone.surface.ru}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 font-extrabold text-[var(--bg-primary)] transition hover:bg-[var(--accent-strong)]"
                href={siteConfig.telegramChat}
                target="_blank"
                rel="noreferrer"
              >
                Узнать цену
                <Send size={18} />
              </a>
              <a
                className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-[var(--border)] px-6 font-extrabold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                href={telHref(siteConfig.phone)}
              >
                <Phone size={18} />
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
