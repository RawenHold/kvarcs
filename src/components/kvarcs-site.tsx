"use client";

import Image, { getImageProps } from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring
} from "framer-motion";
import {
  ArrowRight,
  Calculator,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Factory,
  Grid3X3,
  Hammer,
  Instagram,
  List,
  Mail,
  MapPin,
  Menu,
  Moon,
  PackageCheck,
  Phone,
  Ruler,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
  X,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
  type PointerEvent,
  type TouchEvent
} from "react";
import { stones, type Stone } from "@/lib/catalog-data";
import { collectImagePreloadSources } from "@/lib/image-preload";
import { partnerRegions, partners } from "@/lib/partners-data";
import { siteConfig } from "@/lib/site-config";
import { translations, type Lang } from "@/lib/translations";
import { cn, telHref } from "@/lib/utils";

type Theme = "cloud" | "onyx";
type ViewMode = "grid" | "list";

type KvarcsSiteProps = {
  portfolioImages?: string[];
  certificateImages?: string[];
};

type PortfolioPageProps = {
  images: string[];
};

type CatalogPageProps = {
  certificateImages?: string[];
};

const themeStorageKey = "kvarcs-theme-v3";
const legacyThemeStorageKeys = ["kvarcs-theme", "kvarcs-theme-v2"] as const;
const catalogDetailImageSizes = "(max-width: 1023px) calc(100vw - 1rem), 50vw";
const galleryDetailImageSizes = "(max-width: 1023px) 94vw, 54vw";

function useNextImagePreload(sources: readonly string[], sizes: string, quality: number) {
  const requestedSources = useRef(new Set<string>());
  const pendingImages = useRef(new Map<string, HTMLImageElement>());

  useEffect(() => {
    if (typeof window === "undefined") return;

    sources.forEach((src) => {
      const { props } = getImageProps({ src, alt: "", fill: true, sizes, quality });
      const requestKey = props.srcSet ?? props.src;
      if (requestedSources.current.has(requestKey)) return;

      requestedSources.current.add(requestKey);
      const image = new window.Image();
      image.decoding = "async";
      image.fetchPriority = "low";
      if (props.sizes) image.sizes = props.sizes;
      if (props.srcSet) image.srcset = props.srcSet;

      const release = () => pendingImages.current.delete(requestKey);
      image.onload = release;
      image.onerror = () => {
        requestedSources.current.delete(requestKey);
        release();
      };
      pendingImages.current.set(requestKey, image);
      image.src = props.src;
    });
  }, [quality, sizes, sources]);

  useEffect(
    () => () => {
      pendingImages.current.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
      pendingImages.current.clear();
    },
    []
  );
}
const logoVersion = "20260709-theme-locked";
const logoSourceByTheme: Readonly<Record<Theme, string>> = Object.freeze({
  cloud: "/logo-dark.svg",
  onyx: "/logo-light.svg"
});
const languageFlagSources: Readonly<Record<Lang, string>> = Object.freeze({
  ru: "/lang-ru.svg",
  uz: "/lang-uz.svg"
});

const sectionCopy = {
  ru: {
    applicationsEyebrow: "Области применения",
    applicationsTitle: "Поверхности KVARC-S для Premium / Luxury интерьеров",
    portfolioEyebrow: "Портфолио",
    portfolioTitle: "Готовые работы KVARC-S",
    portfolioBody:
      "Реальные проекты с кварцевыми поверхностями: кухни, острова, стойки, санузлы и коммерческие зоны.",
    portfolioMore: "Открыть всё портфолио",
    portfolioOpen: "Открыть фото",
    portfolioEmpty: "Фотографии портфолио пока не добавлены.",
    portfolioPageTitle: "Портфолио KVARC-S",
    pageSize: "Показывать",
    pageLabel: "Страница",
    catalogMore: "Открыть каталог",
    partnersMore: "Открыть обработчиков",
    certificatesEyebrow: "Документы",
    certificatesTitle: "Сертификаты качества",
    certificateOpen: "Открыть сертификат",
    close: "Закрыть",
    previous: "Назад",
    next: "Вперёд",
    zoomIn: "Увеличить",
    zoomOut: "Уменьшить"
  },
  uz: {
    applicationsEyebrow: "Qo'llanish sohalari",
    applicationsTitle: "Har kuni ishlatiladigan yuzalar uchun kvars",
    portfolioEyebrow: "Portfolio",
    portfolioTitle: "KVARC-S tayyor ishlar",
    portfolioBody:
      "Kvars yuzalar bilan bajarilgan real loyihalar: oshxonalar, orollar, stoykalar, vanna xonalari va tijorat zonalari.",
    portfolioMore: "Barcha portfolioni ochish",
    portfolioOpen: "Rasmni ochish",
    portfolioEmpty: "Portfolio rasmlari hali qo'shilmagan.",
    portfolioPageTitle: "KVARC-S portfolio",
    pageSize: "Ko'rsatish",
    pageLabel: "Sahifa",
    catalogMore: "Katalogni ochish",
    partnersMore: "Ustalarni ochish",
    certificatesEyebrow: "Hujjatlar",
    certificatesTitle: "Sifat sertifikatlari",
    certificateOpen: "Sertifikatni ochish",
    close: "Yopish",
    previous: "Orqaga",
    next: "Oldinga",
    zoomIn: "Kattalashtirish",
    zoomOut: "Kichraytirish"
  }
} as const;

type GalleryLabels = {
  [Key in keyof (typeof sectionCopy)["ru"]]: string;
};

const navItems = [
  { key: "catalog", href: "/catalog" },
  { key: "services", href: "/#services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "partners", href: "/partners" },
  { key: "contacts", href: "/#contacts" }
] as const;

const applicationItems = [
  {
    title: { ru: "Кухонные столешницы", uz: "Oshxona stoleshnitsalari" },
    body: { ru: "Рабочая зона, остров, фартук и барная стойка.", uz: "Ishchi zona, orol, fartuk va bar stoyka." },
    image: "/applications/kitchen-countertops.png"
  },
  {
    title: { ru: "Столешницы для ванных", uz: "Vanna stoleshnitsalari" },
    body: { ru: "Поверхности вокруг раковин и влажных зон.", uz: "Rakowina va nam zonalar atrofidagi yuzalar." },
    image: "/applications/bathroom-countertops.png"
  },
  {
    title: { ru: "Отделка стен ванных", uz: "Vanna devorlari" },
    body: { ru: "Аккуратная облицовка без визуального шума.", uz: "Ortiqcha shovqinsiz tartibli qoplama." },
    image: "/applications/bathroom-walls.png"
  },
  {
    title: { ru: "Облицовка стен", uz: "Devor qoplamasi" },
    body: { ru: "Акцентные панели для дома и коммерции.", uz: "Uy va biznes uchun aksent panellar." },
    image: "/applications/wall-cladding.png"
  },
  {
    title: { ru: "Подоконники", uz: "Deraza tokchalari" },
    body: { ru: "Прочные горизонтальные поверхности.", uz: "Mustahkam gorizontal yuzalar." },
    image: "/applications/window-sills.png"
  },
  {
    title: { ru: "Лестницы", uz: "Zinapoyalar" },
    body: { ru: "Ступени и площадки для интенсивного движения.", uz: "Faol harakat uchun zina va maydonchalar." },
    image: "/applications/stairs.png"
  },
  {
    title: { ru: "Полы внутри помещений", uz: "Ichki pol qoplamalari" },
    body: { ru: "Плоскости для холлов и проходных зон.", uz: "Xoll va o'tish zonalari uchun yuzalar." },
    image: "/applications/indoor-floors.png"
  },
  {
    title: { ru: "Столы", uz: "Stollar" },
    body: { ru: "Обеденные, рабочие и коммерческие столы.", uz: "Ovqatlanish, ish va tijorat stollari." },
    image: "/applications/tables.png"
  }
] as const;

const contact = {
  phone: siteConfig.phone,
  phonePerson: siteConfig.phonePerson,
  telegramChat: siteConfig.telegramChat,
  telegramChannel: siteConfig.telegramChannel,
  instagram: siteConfig.instagram,
  email: siteConfig.email,
  map: siteConfig.map,
  mapEmbed: siteConfig.mapEmbed
};

const heroSlides = [
  "/fillers/11e2b89d928d1b31ccd1a79ed4b0fb3e.png",
  "/fillers/AdobeStock_131848850-scaled.jpeg",
  "/fillers/799f7e87-9f1bc82d31e680788cde82d4df9a9b2c.jpg",
  "/fillers/b56c7b1e032d8911e2adfd8d751584a8.jpg",
  "/fillers/ba5667ecc64450739f510e9d3251618f.jpg",
  "/fillers/Calacatta-2.jpg",
  "/fillers/f1.jpeg",
  "/fillers/i_Calacatta_Vagli_Kitchen_College_Grove_Nashville_Residence_SLCVGLXP2_1000x.webp",
  "/fillers/Neolith-bloggforside.jpg",
  "/fillers/scale_1200.jpg",
  "/fillers/su845mu32ecas3mqudi8sxwphkcs6zof.jpg"
] as const;

function logoSrc(theme: Theme) {
  return `${logoSourceByTheme[theme]}?v=${logoVersion}`;
}

function LogoImage({
  theme,
  className = "",
  priority = false
}: {
  theme: Theme;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={logoSrc(theme)}
      alt="KVARC-S"
      fill
      unoptimized
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}

function TelegramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M20.86 4.48 3.84 11.1c-1.16.46-1.15 1.12-.2 1.41l4.36 1.36 1.68 5.18c.22.61.11.86.75.86.49 0 .71-.23.99-.5l2.38-2.33 4.94 3.64c.91.5 1.57.24 1.8-.85l3.25-15.33c.33-1.34-.51-1.94-1.39-1.56Z"
        fill="currentColor"
      />
      <path
        d="m8.66 13.55 10.13-6.39c.48-.29.92-.13.56.2l-8.67 7.83-.34 3.64-1.68-5.28Z"
        fill="var(--bg-primary)"
        opacity="0.42"
      />
    </svg>
  );
}

export function KvarcsSite({
  portfolioImages = [],
  certificateImages = []
}: KvarcsSiteProps) {
  const [theme, setTheme] = useState<Theme>("cloud");
  const [lang, setLang] = useState<Lang>("ru");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 28 });

  useEffect(() => {
    legacyThemeStorageKeys.forEach((key) => window.localStorage.removeItem(key));
    const savedTheme = window.localStorage.getItem(themeStorageKey) as Theme | null;
    const savedLang = window.localStorage.getItem("kvarcs-lang") as Lang | null;

    setTheme(savedTheme === "cloud" || savedTheme === "onyx" ? savedTheme : "cloud");
    setLang(savedLang === "uz" ? "uz" : "ru");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === "ru" ? "ru" : "uz";
    window.localStorage.setItem("kvarcs-lang", lang);
  }, [lang]);

  return (
    <>
      <motion.div
        className="fixed left-0 top-0 z-[90] h-[3px] origin-left bg-[var(--accent)]"
        style={{ scaleX: progress }}
      />
      <Header
        lang={lang}
        theme={theme}
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={setLang}
        onMenuChange={setMobileMenuOpen}
        onThemeChange={() => setTheme(theme === "onyx" ? "cloud" : "onyx")}
      />
      <main>
        <Hero lang={lang} />
        <Applications lang={lang} />
        <CatalogMarquee lang={lang} />
        <Services lang={lang} />
        <PortfolioMarquee lang={lang} images={portfolioImages} />
        <Certificates lang={lang} images={certificateImages} />
        <Contacts lang={lang} />
      </main>
      <Footer lang={lang} theme={theme} />
    </>
  );
}

export function KvarcsPortfolioPage({ images }: PortfolioPageProps) {
  const [theme, setTheme] = useState<Theme>("cloud");
  const [lang, setLang] = useState<Lang>("ru");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 28 });

  useEffect(() => {
    legacyThemeStorageKeys.forEach((key) => window.localStorage.removeItem(key));
    const savedTheme = window.localStorage.getItem(themeStorageKey) as Theme | null;
    const savedLang = window.localStorage.getItem("kvarcs-lang") as Lang | null;

    setTheme(savedTheme === "cloud" || savedTheme === "onyx" ? savedTheme : "cloud");
    setLang(savedLang === "uz" ? "uz" : "ru");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === "ru" ? "ru" : "uz";
    window.localStorage.setItem("kvarcs-lang", lang);
  }, [lang]);

  return (
    <>
      <motion.div
        className="fixed left-0 top-0 z-[90] h-[3px] origin-left bg-[var(--accent)]"
        style={{ scaleX: progress }}
      />
      <Header
        lang={lang}
        theme={theme}
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={setLang}
        onMenuChange={setMobileMenuOpen}
        onThemeChange={() => setTheme(theme === "onyx" ? "cloud" : "onyx")}
      />
      <main>
        <Portfolio lang={lang} images={images} />
      </main>
      <Footer lang={lang} theme={theme} />
    </>
  );
}

export function KvarcsCatalogPage({ certificateImages = [] }: CatalogPageProps) {
  const [theme, setTheme] = useState<Theme>("cloud");
  const [lang, setLang] = useState<Lang>("ru");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 28 });

  useEffect(() => {
    legacyThemeStorageKeys.forEach((key) => window.localStorage.removeItem(key));
    const savedTheme = window.localStorage.getItem(themeStorageKey) as Theme | null;
    const savedLang = window.localStorage.getItem("kvarcs-lang") as Lang | null;

    setTheme(savedTheme === "cloud" || savedTheme === "onyx" ? savedTheme : "cloud");
    setLang(savedLang === "uz" ? "uz" : "ru");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === "ru" ? "ru" : "uz";
    window.localStorage.setItem("kvarcs-lang", lang);
  }, [lang]);

  const requestQuote = useCallback(() => {
    window.location.href = "/#contacts";
  }, []);

  return (
    <>
      <motion.div
        className="fixed left-0 top-0 z-[90] h-[3px] origin-left bg-[var(--accent)]"
        style={{ scaleX: progress }}
      />
      <Header
        lang={lang}
        theme={theme}
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={setLang}
        onMenuChange={setMobileMenuOpen}
        onThemeChange={() => setTheme(theme === "onyx" ? "cloud" : "onyx")}
      />
      <main>
        <Catalog lang={lang} onRequestQuote={requestQuote} paginated />
        <Certificates lang={lang} images={certificateImages} />
      </main>
      <Footer lang={lang} theme={theme} />
    </>
  );
}

export function KvarcsPartnersPage() {
  const [theme, setTheme] = useState<Theme>("cloud");
  const [lang, setLang] = useState<Lang>("ru");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 28 });

  useEffect(() => {
    legacyThemeStorageKeys.forEach((key) => window.localStorage.removeItem(key));
    const savedTheme = window.localStorage.getItem(themeStorageKey) as Theme | null;
    const savedLang = window.localStorage.getItem("kvarcs-lang") as Lang | null;

    setTheme(savedTheme === "cloud" || savedTheme === "onyx" ? savedTheme : "cloud");
    setLang(savedLang === "uz" ? "uz" : "ru");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === "ru" ? "ru" : "uz";
    window.localStorage.setItem("kvarcs-lang", lang);
  }, [lang]);

  return (
    <>
      <motion.div
        className="fixed left-0 top-0 z-[90] h-[3px] origin-left bg-[var(--accent)]"
        style={{ scaleX: progress }}
      />
      <Header
        lang={lang}
        theme={theme}
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={setLang}
        onMenuChange={setMobileMenuOpen}
        onThemeChange={() => setTheme(theme === "onyx" ? "cloud" : "onyx")}
      />
      <main>
        <Partners lang={lang} />
      </main>
      <Footer lang={lang} theme={theme} />
    </>
  );
}

function Header({
  lang,
  theme,
  mobileMenuOpen,
  onLanguageChange,
  onMenuChange,
  onThemeChange
}: {
  lang: Lang;
  theme: Theme;
  mobileMenuOpen: boolean;
  onLanguageChange: (lang: Lang) => void;
  onMenuChange: (open: boolean) => void;
  onThemeChange: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuTransition, setMenuTransition] = useState<{
    href: string;
    x: number;
    y: number;
  } | null>(null);
  const reduceMotion = useReducedMotion();
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const openMobileLink = (href: string, event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (reduceMotion) {
      onMenuChange(false);
      window.location.href = href;
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setMenuTransition({
      href,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });

    window.setTimeout(() => {
      onMenuChange(false);
      window.location.href = href;
    }, 360);
  };

  const toggleMobileMenuFromPointer = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onMenuChange(!mobileMenuOpen);
  };

  const toggleMobileMenuFromKeyboard = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) {
      onMenuChange(!mobileMenuOpen);
    }
  };

  const closeMobileMenuFromPointer = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onMenuChange(false);
  };

  const closeMobileMenuFromKeyboard = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) {
      onMenuChange(false);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[90] transition-all duration-300",
          scrolled
            ? "border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] shadow-mineral backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="section-shell flex h-20 items-center justify-between gap-3 xl:gap-4">
          <a className="focus-ring relative h-10 w-32 shrink-0 2xl:w-36" href="/" aria-label="KVARC-S">
            <LogoImage theme={theme} className="object-left" priority />
          </a>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-1 rounded-full border border-[var(--border)] bg-[var(--header-nav-bg)] p-1 text-[var(--header-nav-text)] shadow-[0_18px_56px_-36px_rgba(0,0,0,0.68)] backdrop-blur-xl xl:flex"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.key}
                className="focus-ring rounded-full px-3 py-2 text-center text-[0.82rem] font-semibold leading-tight text-current opacity-80 transition hover:bg-[var(--surface-strong)] hover:opacity-100 2xl:px-4 2xl:text-sm"
                href={item.href}
              >
                {t.nav[item.key]}
              </a>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex 2xl:gap-3">
            <ThemeToggle theme={theme} onClick={onThemeChange} />
            <LanguageToggle lang={lang} onChange={onLanguageChange} />
            <MagneticButton href={telHref(contact.phone)} className="px-4 py-3 text-sm 2xl:px-5">
              <Phone size={16} />
              {t.common.call}
            </MagneticButton>
            <a
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-extrabold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] 2xl:px-5"
              href={contact.telegramChat}
              target="_blank"
              rel="noreferrer"
            >
              <TelegramIcon size={16} />
              {t.common.write}
            </a>
          </div>

          <button
            className="focus-ring grid h-12 w-12 touch-manipulation place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] xl:hidden"
            type="button"
            aria-label={mobileMenuOpen ? t.common.close : "Menu"}
            aria-expanded={mobileMenuOpen}
            onPointerDown={toggleMobileMenuFromPointer}
            onClick={toggleMobileMenuFromKeyboard}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-[120] overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] xl:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-shell flex min-h-dvh flex-col py-5">
              <div className="flex h-14 items-center justify-between gap-4">
                <a className="focus-ring relative h-10 w-32 shrink-0" href="/" aria-label="KVARC-S">
                  <LogoImage theme={theme} className="object-left" priority />
                </a>
                <button
                  className="focus-ring grid h-12 w-12 touch-manipulation place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
                  type="button"
                  aria-label={t.common.close}
                  onPointerDown={closeMobileMenuFromPointer}
                  onClick={closeMobileMenuFromKeyboard}
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="mt-7 divide-y divide-[var(--border)] overflow-hidden rounded-stone border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)] shadow-[0_24px_80px_-50px_rgba(0,0,0,0.78)] backdrop-blur-xl">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.key}
                    className="focus-ring group relative flex min-h-14 w-full items-center justify-between gap-4 overflow-hidden px-5 py-3 text-base font-extrabold leading-tight text-[var(--text-primary)] transition hover:bg-[var(--surface-strong)]"
                    href={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    onClick={(event) => openMobileLink(item.href, event)}
                  >
                    <span className="absolute inset-y-3 left-0 w-1 origin-y scale-y-0 rounded-r-full bg-[var(--accent)] transition group-hover:scale-y-100" />
                    <span>{t.nav[item.key]}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
                  </motion.a>
                ))}
              </nav>
              <div className="mt-auto grid gap-3 pt-8">
                <div className="flex items-center justify-center gap-3">
                  <ThemeToggle theme={theme} onClick={onThemeChange} />
                  <LanguageToggle lang={lang} onChange={onLanguageChange} />
                </div>
                <MagneticButton href={telHref(contact.phone)} className="w-full justify-center px-5 py-4">
                  <Phone size={18} />
                  {t.common.call}
                </MagneticButton>
                <a
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-4 font-extrabold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  href={contact.telegramChat}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TelegramIcon size={18} />
                  {t.common.write}
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {menuTransition ? (
          <motion.div
            key={menuTransition.href}
            className="pointer-events-none fixed z-[140] h-12 w-12 rounded-full bg-[radial-gradient(circle_at_center,var(--accent)_0%,var(--surface)_58%,var(--bg-primary)_100%)] shadow-[0_0_80px_rgba(212,161,92,0.34)] xl:hidden"
            style={{
              left: menuTransition.x - 24,
              top: menuTransition.y - 24
            }}
            initial={{ scale: 0, opacity: 0.98 }}
            animate={{ scale: 58, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => setMenuTransition(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

function ThemeToggle({ theme, onClick }: { theme: Theme; onClick: () => void }) {
  return (
    <button
      className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] transition hover:border-[var(--border-strong)] hover:shadow-mineral"
      type="button"
      aria-label="Toggle theme"
      onClick={onClick}
    >
      {theme === "onyx" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function LanguageToggle({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  const options: Lang[] = ["ru", "uz"];

  return (
    <div
      className="relative grid grid-cols-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[0_14px_42px_-34px_rgba(0,0,0,0.7)]"
      role="group"
      aria-label="Language"
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[var(--accent)] shadow-[var(--shadow-glow)] transition-transform duration-300 ease-out",
          lang === "uz" && "translate-x-full"
        )}
      />
      {options.map((option) => (
        <button
          key={option}
          className={cn(
            "focus-ring relative z-10 grid h-10 w-11 place-items-center rounded-full transition",
            lang === option
              ? "text-[var(--bg-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
          type="button"
          aria-pressed={lang === option}
          aria-label={translations[option].languageName}
          onClick={() => onChange(option)}
        >
          <Image
            src={languageFlagSources[option]}
            alt=""
            width={26}
            height={26}
            unoptimized
            className="h-6 w-6 shrink-0 rounded-full object-contain"
          />
        </button>
      ))}
    </div>
  );
}

function MagneticButton({
  children,
  className,
  disabled = false,
  onClick,
  href,
  type = "button"
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const [transform, setTransform] = useState("translate3d(0,0,0)");
  const classes = cn(
    "focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--accent)] font-extrabold text-[var(--bg-primary)] transition hover:bg-[var(--accent-strong)] hover:shadow-[var(--shadow-glow)] disabled:cursor-not-allowed disabled:opacity-60",
    className
  );

  const onMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    setTransform(`translate3d(${x * 0.12}px, ${y * 0.12}px, 0)`);
  };

  const onMouseLeave = () => setTransform("translate3d(0,0,0)");

  if (href) {
    return (
      <a
        ref={ref}
        className={classes}
        href={href}
        style={{ transform }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      className={classes}
      type={type}
      style={{ transform }}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
}

function Hero({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const interval = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % heroSlides.length);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  return (
    <section
      id="top"
      className="relative isolate min-h-[94vh] overflow-hidden pt-28"
      onMouseMove={(event) => {
        if (reduceMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setTilt({
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5
        });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="absolute inset-0 -z-20">
        {heroSlides.map((slide, index) => (
          <div
            key={slide}
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-[1200ms] ease-in-out",
              activeSlide === index && "opacity-100"
            )}
          >
            <Image
              src={slide}
              alt=""
              fill
              sizes="100vw"
              className="grain-mask object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 -z-10" style={{ background: "var(--hero-scrim)" }} />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

      <div className="section-shell grid min-h-[calc(94vh-112px)] items-center gap-12 pb-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(390px,0.68fr)]">
        <motion.div
          className="max-w-[760px]"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-5">{t.hero.label}</p>
          <h1 className="display-title max-w-3xl text-[clamp(2rem,3.35vw,3.95rem)] leading-[1.04] text-[var(--text-primary)] drop-shadow-[0_18px_44px_rgba(0,0,0,0.24)]">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-[var(--text-secondary)] md:text-lg">
            {t.hero.lead}
          </p>
          <HeroBenefits items={t.hero.benefits} />
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <MagneticButton href={telHref(contact.phone)} className="justify-center px-6 py-4">
              <Phone size={18} />
              {t.common.call}
            </MagneticButton>
            <a
              href={contact.telegramChat}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-6 py-4 font-extrabold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <TelegramIcon size={18} />
              {t.common.write}
            </a>
            <a
              href="#catalog"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-6 py-4 font-extrabold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {t.nav.catalog}
              <Sparkles size={18} />
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto aspect-[4/5] w-full max-w-[520px]"
          initial={{ opacity: 0, rotate: 4, y: 52 }}
          animate={{ opacity: 1, rotate: 0, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="surface absolute inset-0 overflow-hidden rounded-stone"
            style={{
              transform: `perspective(1100px) rotateX(${tilt.y * -6}deg) rotateY(${tilt.x * 8}deg) translate3d(${tilt.x * 12}px, ${tilt.y * 12}px, 0)`
            }}
          >
            {heroSlides.map((slide, index) => (
              <div
                key={slide}
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-[1200ms] ease-in-out",
                  activeSlide === index && "opacity-100"
                )}
              >
                <Image
                  src={slide}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 90vw, 520px"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_8%,rgba(255,255,255,0.24),transparent_26%),linear-gradient(to_top,rgba(0,0,0,0.58),transparent_48%)]" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-white/65">KVARC-S</p>
                <p className="display-title mt-1 text-2xl">Quartz surfaces</p>
              </div>
              <p className="max-w-32 text-right text-xs font-bold uppercase tracking-[0.14em] text-white/72">
                Tashkent
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="section-shell flex items-center justify-between pb-6 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        <span>{t.hero.scroll}</span>
        <span className="h-px flex-1 bg-[var(--border)] mx-5" />
        <span>KVARC-S / Tashkent</span>
      </div>
    </section>
  );
}

function HeroBenefits({ items }: { items: readonly string[] }) {
  const icons = [Truck, ShieldCheck, Calculator, Clock];

  return (
    <div className="mt-7 grid overflow-hidden rounded-stone border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] text-[var(--text-primary)] shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = icons[index] ?? ShieldCheck;
        return (
          <div
            key={item}
            className="flex min-h-[72px] items-center gap-3 border-[var(--border)] px-4 py-3 sm:border-r last:border-r-0"
          >
            <Icon className="h-7 w-7 shrink-0 text-[var(--text-secondary)]" strokeWidth={1.7} />
            <span className="text-[0.78rem] font-extrabold leading-5 text-[var(--text-primary)] md:text-sm">
              {item}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Applications({ lang }: { lang: Lang }) {
  const copy = sectionCopy[lang];

  return (
    <section id="applications" className="py-20">
      <div className="section-shell">
        <Reveal className="surface overflow-hidden rounded-stone p-5 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">{copy.applicationsEyebrow}</p>
              <h2 className="display-title mt-3 text-3xl leading-tight md:text-5xl">
                {copy.applicationsTitle}
              </h2>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {applicationItems.map((item, index) => (
              <motion.div
                key={item.image}
                className="group flex min-h-40 flex-col items-center justify-between rounded-[8px] border border-[var(--application-card-border)] bg-[var(--application-card-bg)] p-4 text-center text-[var(--application-card-text)] shadow-[0_20px_70px_-44px_rgba(0,0,0,0.75)] transition duration-300 hover:scale-[1.025] hover:border-[var(--accent)]"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.03 }}
              >
                <Image
                  src={item.image}
                  alt=""
                  width={96}
                  height={96}
                  className="h-20 w-20 object-contain opacity-90 transition duration-300 group-hover:scale-110 group-hover:opacity-100 md:h-24 md:w-24"
                />
                <h3 className="mt-4 text-sm font-extrabold leading-5 text-[var(--application-card-text)]">
                  {item.title[lang]}
                </h3>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CatalogMarquee({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const copy = sectionCopy[lang];
  const loopStones = [...stones, ...stones];

  return (
    <section id="catalog" className="overflow-hidden py-20">
      <div className="section-shell text-center">
        <Reveal className="mx-auto max-w-4xl">
          <p className="eyebrow">{t.catalog.eyebrow}</p>
          <h2 className="display-title mt-4 text-4xl leading-tight md:text-6xl">
            {t.catalog.title}
          </h2>
          <a
            className="focus-ring mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] px-5 text-sm font-extrabold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            href="/catalog"
          >
            {copy.catalogMore}
          </a>
        </Reveal>
      </div>

      <div className="mt-10">
        <div className="catalog-marquee-track flex w-max gap-3 will-change-transform">
          {loopStones.map((stone, index) => (
            <a
              key={`${stone.slug}-${index}`}
              className="focus-ring group relative aspect-[5/4] w-[66vw] max-w-[350px] shrink-0 overflow-hidden rounded-[8px] bg-white shadow-[var(--shadow-soft)] sm:w-[36vw] lg:w-[24vw] xl:w-[18vw]"
              href="/catalog"
              aria-label={`${t.common.view} ${stone.name}`}
            >
              <Image
                src={stone.image}
                alt={stone.name}
                fill
                sizes="(max-width: 640px) 66vw, (max-width: 1024px) 36vw, 18vw"
                className="object-contain transition duration-500 group-hover:scale-[1.015]"
                quality={48}
              />
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 text-left text-sm font-extrabold uppercase text-white">
                #{stone.number} {stone.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Catalog({
  lang,
  onRequestQuote,
  paginated = false
}: {
  lang: Lang;
  onRequestQuote: (stone: Stone) => void;
  paginated?: boolean;
}) {
  const t = translations[lang];
  const [view, setView] = useState<ViewMode>("grid");
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageCount = Math.max(1, Math.ceil(stones.length / pageSize));
  const visibleStones = useMemo(() => {
    if (!paginated) return stones;
    const start = (page - 1) * pageSize;
    return stones.slice(start, start + pageSize);
  }, [page, pageSize, paginated]);

  return (
    <section
      id="catalog"
      className="relative py-24 pt-28"
    >
      <div className="section-shell">
        <Reveal className="mx-auto max-w-4xl text-center">
            <p className="eyebrow">{t.catalog.eyebrow}</p>
            <h2 className="display-title mt-4 text-4xl leading-tight md:text-6xl">
              {t.catalog.title}
            </h2>
        </Reveal>

        <div className="mt-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-bold text-[var(--text-secondary)]">
                {paginated ? `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, stones.length)} / ${stones.length}` : `${stones.length} / ${stones.length}`}
              </p>
              <div className="flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
                <ViewButton active={view === "list"} onClick={() => setView("list")}>
                  <List size={17} />
                  {t.catalog.list}
                </ViewButton>
                <ViewButton active={view === "grid"} onClick={() => setView("grid")}>
                  <Grid3X3 size={17} />
                  {t.catalog.grid}
                </ViewButton>
              </div>
            </div>

          <motion.div
            layout
            className={cn(
              view === "grid"
                ? "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5"
                : "grid grid-cols-1 gap-4"
            )}
          >
            <AnimatePresence mode="popLayout">
              {visibleStones.map((stone) => (
                <StoneCard
                  key={stone.slug}
                  lang={lang}
                  stone={stone}
                  view={view}
                  onDetails={() => setSelectedStone(stone)}
                  onRequestQuote={() => onRequestQuote(stone)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
          {paginated ? (
            <PaginationControls
              className="mt-8"
              lang={lang}
              page={page}
              pageCount={pageCount}
              pageSize={pageSize}
              pageSizeOptions={[10, 25, 50, 100]}
              onPageChange={setPage}
              onPageSizeChange={(nextSize) => {
                setPageSize(nextSize);
                setPage(1);
              }}
            />
          ) : null}
        </div>
      </div>

      <StoneDetails
        lang={lang}
        stone={selectedStone}
        onClose={() => setSelectedStone(null)}
        onSelectStone={setSelectedStone}
        onRequestQuote={(stone) => {
          setSelectedStone(null);
          onRequestQuote(stone);
        }}
      />
    </section>
  );
}

function ViewButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-extrabold transition",
        active
          ? "bg-[var(--accent)] text-[var(--bg-primary)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function PaginationControls({
  lang,
  page,
  pageCount,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  className
}: {
  lang: Lang;
  page: number;
  pageCount: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}) {
  const copy = sectionCopy[lang];
  const pages = useMemo(() => {
    if (pageCount <= 9) {
      return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    if (page <= 5) {
      return [...Array.from({ length: 9 }, (_, index) => index + 1), "end-ellipsis"] as const;
    }

    if (page >= pageCount - 4) {
      return [
        "start-ellipsis",
        ...Array.from({ length: 9 }, (_, index) => pageCount - 8 + index)
      ] as const;
    }

    return [
      "start-ellipsis",
      page - 3,
      page - 2,
      page - 1,
      page,
      page + 1,
      page + 2,
      page + 3,
      "end-ellipsis"
    ] as const;
  }, [page, pageCount]);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-stone border border-[var(--border)] bg-[var(--surface)] p-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <label className="flex items-center gap-2 text-sm font-extrabold text-[var(--text-secondary)]">
        {copy.pageSize}
        <select
          className="focus-ring h-10 rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-3 text-[var(--text-primary)] outline-none"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="focus-ring min-h-10 rounded-full border border-[var(--border)] px-4 text-sm font-extrabold text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          {copy.previous}
        </button>
        {pages.map((item, index) =>
          typeof item === "number" ? (
            <button
              key={item}
              className={cn(
                "focus-ring grid h-10 w-10 place-items-center rounded-full text-sm font-extrabold transition",
                item === page
                  ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                  : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              )}
              type="button"
              aria-label={`${copy.pageLabel} ${item}`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ) : (
            <span
              key={`${item}-${index}`}
              className="grid h-10 w-8 place-items-center text-sm font-extrabold text-[var(--text-muted)]"
              aria-hidden="true"
            >
              ...
            </span>
          )
        )}
        <button
          className="focus-ring min-h-10 rounded-full border border-[var(--border)] px-4 text-sm font-extrabold text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        >
          {copy.next}
        </button>
      </div>
    </div>
  );
}

function StoneCard({
  lang,
  stone,
  view,
  onDetails,
  onRequestQuote
}: {
  lang: Lang;
  stone: Stone;
  view: ViewMode;
  onDetails: () => void;
  onRequestQuote: () => void;
}) {
  const t = translations[lang];
  const isList = view === "list";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      className={cn(
        "surface group overflow-hidden rounded-stone",
        isList && "grid md:grid-cols-[minmax(140px,180px)_1fr]"
      )}
    >
      <button
        className={cn(
          "focus-ring relative block w-full overflow-hidden bg-white text-left",
          isList ? "aspect-[16/10] md:aspect-auto md:min-h-full" : "aspect-[5/4]"
        )}
        type="button"
        onClick={onDetails}
      >
        <Image
          src={stone.image}
          alt={stone.name}
          fill
          sizes={isList ? "(max-width: 768px) 100vw, 180px" : "(max-width: 768px) 50vw, 20vw"}
          className="object-contain transition duration-700 group-hover:scale-[1.015]"
          quality={64}
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/52 to-transparent" />
        <div className="absolute left-2 top-2 rounded-full bg-black/45 px-2 py-1 text-[0.65rem] font-extrabold text-white backdrop-blur">
          #{stone.number}
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 text-white">
          <span className="text-[0.66rem] font-extrabold uppercase">
            {t.common.details}
          </span>
          <ArrowRight size={14} />
        </div>
      </button>

      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">
              KVARC-S #{stone.number}
            </p>
            <h3 className="mt-1 text-sm font-extrabold leading-5">{stone.name}</h3>
          </div>
          <span className="rounded-full border border-[var(--border)] px-2 py-1 text-[0.65rem] font-bold text-[var(--text-secondary)]">
            {stone.specs.thicknessMm} мм
          </span>
        </div>
        {isList ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
            {stone.description[lang]}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="focus-ring inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--border)] px-3 text-xs font-extrabold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            type="button"
            onClick={onDetails}
          >
            {t.common.details}
          </button>
          <button
            className="focus-ring inline-flex min-h-9 items-center gap-2 rounded-full bg-[var(--accent)] px-3 text-xs font-extrabold text-[var(--bg-primary)] transition hover:bg-[var(--accent-strong)]"
            type="button"
            onClick={onRequestQuote}
          >
            {t.common.price}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function SpecPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-stone border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-primary)_60%,transparent)] p-3">
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1 font-extrabold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function StoneDetails({
  lang,
  stone,
  onClose,
  onSelectStone,
  onRequestQuote
}: {
  lang: Lang;
  stone: Stone | null;
  onClose: () => void;
  onSelectStone: (stone: Stone) => void;
  onRequestQuote: (stone: Stone) => void;
}) {
  const t = translations[lang];
  const reduceMotion = useReducedMotion();
  const detailImages = useMemo(() => {
    if (!stone) return [];
    return stone.detailImages?.length ? stone.detailImages : [stone.image];
  }, [stone]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const detailsImage = detailImages[activeImageIndex] ?? "";
  const detailsImageClassName = "object-contain p-3";
  const previewStones = useMemo(() => {
    if (!stone) return [];
    const currentIndex = Math.max(0, stones.findIndex((item) => item.slug === stone.slug));
    const count = Math.min(10, stones.length);

    return Array.from({ length: count }, (_, offset) => stones[(currentIndex + offset) % stones.length]);
  }, [stone]);
  const preloadSources = useMemo(
    () =>
      collectImagePreloadSources(
        detailImages,
        previewStones.map((previewStone) => previewStone.detailImages?.[0] ?? previewStone.image)
      ),
    [detailImages, previewStones]
  );
  useNextImagePreload(preloadSources, catalogDetailImageSizes, 82);

  useEffect(() => {
    if (!stone) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, stone]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [stone?.slug]);

  useEffect(() => {
    if (reduceMotion || detailImages.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveImageIndex((index) => (index + 1) % detailImages.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [detailImages.length, reduceMotion]);

  return (
    <AnimatePresence>
      {stone ? (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/60 p-2 backdrop-blur-md sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={stone.name}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            className="catalog-dialog-stack"
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <div className="catalog-dialog surface relative rounded-stone">
              <button
                className="focus-ring absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] text-[var(--text-primary)] shadow-lg backdrop-blur transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                type="button"
                aria-label={t.common.close}
                autoFocus
                onClick={onClose}
              >
                <X size={20} />
              </button>

              <div className="catalog-dialog-media bg-[var(--bg-primary)]">
                <div className="catalog-dialog-visual">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={detailsImage}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={detailsImage}
                        alt={stone.name}
                        fill
                        className={detailsImageClassName}
                        sizes={catalogDetailImageSizes}
                        quality={82}
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                  <p className="absolute bottom-5 left-5 rounded-full bg-black/45 px-4 py-2 text-sm font-extrabold text-white backdrop-blur">
                    KVARC-S #{stone.number}
                  </p>
                  {detailImages.length > 1 ? (
                    <div className="absolute bottom-5 right-5 flex gap-1.5">
                      {detailImages.map((image, index) => (
                        <button
                          key={image}
                          className={cn(
                            "focus-ring h-2.5 rounded-full transition",
                            activeImageIndex === index ? "w-7 bg-white" : "w-2.5 bg-white/45"
                          )}
                          type="button"
                          aria-label={`${t.common.view} ${index + 1}`}
                          onClick={() => setActiveImageIndex(index)}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="catalog-dialog-info p-5 sm:p-6 md:p-8">
                <div className="pr-14">
                  <p className="eyebrow">Quartz agglomerate</p>
                  <h3 className="display-title mt-3 text-4xl leading-tight md:text-5xl">
                    {stone.name}
                  </h3>
                </div>
                <p className="mt-5 text-base leading-7 text-[var(--text-secondary)] md:mt-6 md:text-lg md:leading-8">
                  {stone.description[lang]}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 md:mt-7">
                  <SpecPill label={t.specs.width} value={`${stone.specs.widthMm} мм`} />
                  <SpecPill label={t.specs.height} value={`${stone.specs.heightMm} мм`} />
                  <SpecPill label={t.specs.thickness} value={`${stone.specs.thicknessMm} мм`} />
                  <SpecPill label={t.specs.area} value={`${stone.specs.areaM2} м²`} />
                  <SpecPill label={t.specs.surface} value={stone.surface[lang]} />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 md:mt-7">
                  <MagneticButton
                    className="justify-center px-6 py-4"
                    onClick={() => onRequestQuote(stone)}
                  >
                    {t.common.price}
                    <Send size={18} />
                  </MagneticButton>
                  <a
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-6 py-4 font-extrabold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    href={telHref(contact.phone)}
                  >
                    <Phone size={18} />
                    {contact.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="catalog-preview-panel surface">
              <nav className="media-preview-strip" aria-label={t.common.view}>
                {previewStones.map((previewStone) => {
                  const previewImage = previewStone.detailImages?.[0] ?? previewStone.image;

                  return (
                    <button
                      key={previewStone.slug}
                      className={cn(
                        "media-preview-thumb",
                        previewStone.slug === stone.slug && "is-active"
                      )}
                      type="button"
                      aria-label={`${t.common.view} ${previewStone.name}`}
                      aria-pressed={previewStone.slug === stone.slug}
                      onClick={() => onSelectStone(previewStone)}
                    >
                      <Image
                        src={previewImage}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-contain p-1"
                        quality={42}
                      />
                      <span className="media-preview-thumb-number">#{previewStone.number}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Services({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const icons = [Factory, Ruler, Calculator, Hammer, Truck, PackageCheck];
  const partnersCta = lang === "ru" ? "Выбрать обработчика" : "Ustani tanlash";

  return (
    <section id="services" className="py-24">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{t.services.eyebrow}</p>
          <h2 className="display-title mt-4 text-4xl leading-tight md:text-6xl">
            {t.services.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">
            {t.services.body}
          </p>
        </Reveal>

        <div className="service-flow mt-12">
          <ol className="relative z-10 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {t.services.steps.map((step, index) => {
              const Icon = icons[index] ?? ClipboardCheck;
              return (
                <motion.li
                  key={step}
                  className="service-step-card group flex min-h-[190px] flex-col items-center justify-center rounded-stone p-5 text-center"
                  style={{ "--step-index": index + 1 } as CSSProperties}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="service-step-icon relative z-10">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>
                  <p className="service-step-index relative z-10 mt-5">
                    0{index + 1}
                  </p>
                  <h3 className="service-step-title relative z-10 mt-2 max-w-[14rem]">
                    {step}
                  </h3>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <div className="mt-10 flex justify-center">
          <MagneticButton href="/partners" className="justify-center px-6 py-4">
            {partnersCta}
            <ArrowRight size={18} />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

function PortfolioMarquee({ lang, images }: { lang: Lang; images: string[] }) {
  const copy = sectionCopy[lang];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const loopImages = images.length > 0 ? [...images, ...images] : [];

  if (images.length === 0) return null;

  return (
    <section id="portfolio-preview" className="overflow-hidden py-20">
      <div className="section-shell">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{copy.portfolioEyebrow}</p>
            <h2 className="display-title mt-4 text-4xl leading-tight md:text-6xl">
              {copy.portfolioTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">
              {copy.portfolioBody}
            </p>
          </div>
          <a
            className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] px-5 text-sm font-extrabold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            href="/portfolio"
          >
            {copy.portfolioMore}
          </a>
        </Reveal>
      </div>

      <div className="mt-10">
        <div className="portfolio-marquee-track flex w-max gap-3 will-change-transform">
          {loopImages.map((src, index) => {
            const realIndex = index % images.length;
            return (
              <button
                key={`${src}-${index}`}
                className="focus-ring group relative aspect-[4/3] w-[66vw] max-w-[410px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--surface-strong)] shadow-[var(--shadow-soft)] sm:w-[40vw] lg:w-[29vw] xl:w-[22vw]"
                type="button"
                aria-label={`${copy.portfolioOpen} ${realIndex + 1}`}
                onClick={() => setActiveIndex(realIndex)}
              >
                <Image
                  src={src}
                  alt={`KVARC-S portfolio ${realIndex + 1}`}
                  fill
                  sizes="(max-width: 640px) 66vw, (max-width: 1024px) 40vw, 22vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.045]"
                  quality={48}
                />
                <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
              </button>
            );
          })}
        </div>
      </div>

      <GalleryLightbox
        images={images}
        activeIndex={activeIndex}
        labels={copy}
        showPreviewStrip
        onClose={() => setActiveIndex(null)}
        onChange={setActiveIndex}
      />
    </section>
  );
}

function Portfolio({ lang, images }: { lang: Lang; images: string[] }) {
  const copy = sectionCopy[lang];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const defaultPageSize = Math.max(10, Math.ceil(images.length / 10));
  const pageSizeOptions = Array.from(new Set([defaultPageSize, 10, 25, 50, 100])).sort(
    (a, b) => a - b
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const pageCount = Math.max(1, Math.ceil(images.length / pageSize));
  const visibleImages = useMemo(() => {
    const start = (page - 1) * pageSize;
    return images.slice(start, start + pageSize);
  }, [images, page, pageSize]);

  return (
    <section id="portfolio" className="py-24 pt-28">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">{copy.portfolioEyebrow}</p>
          <h2 className="display-title mt-4 text-4xl leading-tight md:text-6xl">
            {copy.portfolioPageTitle}
          </h2>
        </Reveal>

        {images.length > 0 ? (
          <>
            <PaginationControls
              className="mt-8"
              lang={lang}
              page={page}
              pageCount={pageCount}
              pageSize={pageSize}
              pageSizeOptions={pageSizeOptions}
              onPageChange={setPage}
              onPageSizeChange={(nextSize) => {
                setPageSize(nextSize);
                setPage(1);
                setActiveIndex(null);
              }}
            />
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {visibleImages.map((src, index) => (
                <button
                  key={src}
                  className="focus-ring group relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[var(--surface-strong)] [contain-intrinsic-size:220px] [content-visibility:auto]"
                  type="button"
                  aria-label={`${copy.portfolioOpen} ${(page - 1) * pageSize + index + 1}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    src={src}
                    alt={`KVARC-S portfolio ${(page - 1) * pageSize + index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.045]"
                    quality={52}
                  />
                  <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="surface mt-10 rounded-stone p-10 text-center text-[var(--text-secondary)]">
            {copy.portfolioEmpty}
          </div>
        )}
      </div>

      <GalleryLightbox
        images={visibleImages}
        activeIndex={activeIndex}
        labels={copy}
        showPreviewStrip
        onClose={() => setActiveIndex(null)}
        onChange={setActiveIndex}
      />
    </section>
  );
}

function Certificates({ lang, images }: { lang: Lang; images: string[] }) {
  const copy = sectionCopy[lang];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <section id="certificates" className="py-20">
      <div className="section-shell">
        <Reveal className="surface relative overflow-hidden rounded-stone p-5 shadow-[var(--shadow-glow)] md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(212,161,92,0.22),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.12),transparent_30%)]" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[0.58fr_1fr] lg:items-center">
            <div className="text-center">
              <p className="eyebrow">{copy.certificatesEyebrow}</p>
              <h2 className="display-title mt-4 text-4xl leading-tight md:text-5xl">
                {copy.certificatesTitle}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {images.map((src, index) => (
                <button
                  key={src}
                  className="focus-ring group relative aspect-[4/5] overflow-hidden rounded-[8px] border border-[var(--border)] bg-white shadow-[0_24px_70px_-36px_rgba(0,0,0,0.55)] transition duration-300 hover:scale-[1.018]"
                  type="button"
                  aria-label={`${copy.certificateOpen} ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    src={src}
                    alt={`KVARC-S certificate ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    className="object-contain p-2"
                    quality={82}
                  />
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <GalleryLightbox
        images={images}
        activeIndex={activeIndex}
        labels={copy}
        onClose={() => setActiveIndex(null)}
        onChange={setActiveIndex}
      />
    </section>
  );
}

function GalleryLightbox({
  images,
  activeIndex,
  labels,
  showPreviewStrip = false,
  onClose,
  onChange
}: {
  images: string[];
  activeIndex: number | null;
  labels: GalleryLabels;
  showPreviewStrip?: boolean;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [direction, setDirection] = useState(0);
  const [touchState, setTouchState] = useState<{
    mode: "swipe" | "pinch" | null;
    startX: number;
    currentX: number;
    startDistance: number;
    startZoom: number;
  }>({
    mode: null,
    startX: 0,
    currentX: 0,
    startDistance: 0,
    startZoom: 1
  });

  const isOpen = activeIndex !== null && images[activeIndex] !== undefined;
  const activeSrc = isOpen ? images[activeIndex] : "";
  const previousIndex =
    activeIndex !== null && images.length > 0 ? (activeIndex - 1 + images.length) % images.length : 0;
  const nextIndex =
    activeIndex !== null && images.length > 0 ? (activeIndex + 1) % images.length : 0;
  const previousSrc = images[previousIndex] ?? "";
  const nextSrc = images[nextIndex] ?? "";
  const previewIndexes = useMemo(() => {
    if (activeIndex === null || images.length === 0) return [];
    const count = Math.min(10, images.length);

    return Array.from({ length: count }, (_, offset) => (activeIndex + offset) % images.length);
  }, [activeIndex, images.length]);
  const preloadSources = useMemo(
    () =>
      collectImagePreloadSources(
        [activeSrc, previousSrc, nextSrc],
        previewIndexes.map((index) => images[index] ?? "")
      ),
    [activeSrc, images, nextSrc, previewIndexes, previousSrc]
  );
  useNextImagePreload(preloadSources, galleryDetailImageSizes, 90);

  const changeTo = useCallback(
    (index: number, nextDirection = 0) => {
      setDirection(nextDirection);
      onChange(index);
    },
    [onChange]
  );

  const goTo = useCallback(
    (nextDirection: -1 | 1) => {
      if (activeIndex === null || images.length === 0) return;
      changeTo((activeIndex + nextDirection + images.length) % images.length, nextDirection);
    },
    [activeIndex, changeTo, images.length]
  );

  const updateZoom = useCallback((nextZoom: number) => {
    setZoom(Math.min(3, Math.max(1, nextZoom)));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setZoom(1);
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goTo(-1);
      if (event.key === "ArrowRight") goTo(1);
      if (event.key === "+" || event.key === "=") updateZoom(zoom + 0.25);
      if (event.key === "-") updateZoom(zoom - 0.25);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, isOpen, onClose, updateZoom, zoom]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const distance = (event: TouchEvent<HTMLDivElement>) => {
    const [first, second] = [event.touches[0], event.touches[1]];
    if (!first || !second) return 0;
    return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      setTouchState({
        mode: "pinch",
        startX: 0,
        currentX: 0,
        startDistance: distance(event),
        startZoom: zoom
      });
      return;
    }

    const touch = event.touches[0];
    if (!touch) return;
    setTouchState({
      mode: "swipe",
      startX: touch.clientX,
      currentX: touch.clientX,
      startDistance: 0,
      startZoom: zoom
    });
  };

  const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (touchState.mode === "pinch" && event.touches.length === 2) {
      event.preventDefault();
      const nextDistance = distance(event);
      if (touchState.startDistance > 0) {
        updateZoom(touchState.startZoom * (nextDistance / touchState.startDistance));
      }
      return;
    }

    const touch = event.touches[0];
    if (touchState.mode === "swipe" && touch) {
      setTouchState((state) => ({ ...state, currentX: touch.clientX }));
    }
  };

  const onTouchEnd = () => {
    if (touchState.mode === "swipe" && zoom === 1) {
      const deltaX = touchState.currentX - touchState.startX;
      if (Math.abs(deltaX) > 58) {
        goTo(deltaX > 0 ? -1 : 1);
      }
    }

    setTouchState((state) => ({ ...state, mode: null }));
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[120] overflow-hidden bg-black/90 text-white backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(212,161,92,0.18),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.62))]" />
          <button
            className="focus-ring absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            type="button"
            aria-label={labels.close}
            onClick={onClose}
          >
            <X size={22} />
          </button>

          <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
            <span>{(activeIndex ?? 0) + 1}</span>
            <span className="text-white/45">/</span>
            <span>{images.length}</span>
          </div>

          <div className="absolute inset-x-4 bottom-4 z-20 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/10 p-2 backdrop-blur">
              <button
                className="focus-ring grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/15 disabled:opacity-40"
                type="button"
                aria-label={labels.zoomOut}
                disabled={zoom <= 1}
                onClick={() => updateZoom(zoom - 0.25)}
              >
                <ZoomOut size={20} />
              </button>
              <span className="min-w-14 text-center text-xs font-extrabold tabular-nums text-white/80">
                {Math.round(zoom * 100)}%
              </span>
              <button
                className="focus-ring grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/15 disabled:opacity-40"
                type="button"
                aria-label={labels.zoomIn}
                disabled={zoom >= 3}
                onClick={() => updateZoom(zoom + 0.25)}
              >
                <ZoomIn size={20} />
              </button>
            </div>
            {showPreviewStrip && previewIndexes.length > 1 ? (
              <div className="media-preview-strip max-w-[min(100%,780px)] bg-black/35 text-white backdrop-blur-xl">
                {previewIndexes.map((index) => (
                  <button
                    key={`${images[index]}-${index}`}
                    className={cn("media-preview-thumb", index === activeIndex && "is-active")}
                    type="button"
                    aria-label={`${labels.portfolioOpen} ${index + 1}`}
                    onClick={() => {
                      if (activeIndex === null) return;
                      changeTo(index, index >= activeIndex ? 1 : -1);
                    }}
                  >
                    <Image
                      src={images[index]}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                      quality={36}
                    />
                    <span className="media-preview-thumb-number">{index + 1}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            className="focus-ring absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:grid"
            type="button"
            aria-label={labels.previous}
            onClick={() => goTo(-1)}
          >
            <ChevronLeft size={26} />
          </button>
          <button
            className="focus-ring absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:grid"
            type="button"
            aria-label={labels.next}
            onClick={() => goTo(1)}
          >
            <ChevronRight size={26} />
          </button>

          <div
            className={cn(
              "relative flex h-full w-full items-center justify-center overflow-hidden px-4 pt-20",
              showPreviewStrip ? "pb-44" : "pb-20"
            )}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: "none" }}
          >
            {images.length > 1 ? (
              <>
                <button
                  className="focus-ring absolute left-[max(1rem,4vw)] top-1/2 z-10 hidden h-[58vh] w-[18vw] max-w-[260px] -translate-y-1/2 overflow-hidden rounded-stone border border-white/10 bg-white/5 opacity-50 shadow-[0_24px_80px_-44px_rgba(0,0,0,0.9)] transition hover:opacity-80 lg:block"
                  type="button"
                  aria-label={labels.previous}
                  onClick={() => goTo(-1)}
                >
                  <Image
                    src={previousSrc}
                    alt=""
                    fill
                    sizes="18vw"
                    className="object-cover"
                    quality={42}
                  />
                  <span className="absolute inset-0 bg-black/35" />
                  <span className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur">
                    <ChevronLeft size={24} />
                  </span>
                </button>
                <button
                  className="focus-ring absolute right-[max(1rem,4vw)] top-1/2 z-10 hidden h-[58vh] w-[18vw] max-w-[260px] -translate-y-1/2 overflow-hidden rounded-stone border border-white/10 bg-white/5 opacity-50 shadow-[0_24px_80px_-44px_rgba(0,0,0,0.9)] transition hover:opacity-80 lg:block"
                  type="button"
                  aria-label={labels.next}
                  onClick={() => goTo(1)}
                >
                  <Image
                    src={nextSrc}
                    alt=""
                    fill
                    sizes="18vw"
                    className="object-cover"
                    quality={42}
                  />
                  <span className="absolute inset-0 bg-black/35" />
                  <span className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur">
                    <ChevronRight size={24} />
                  </span>
                </button>
              </>
            ) : null}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeSrc}
                className={cn(
                  "relative z-20 h-full w-full max-w-[min(94vw,1040px)] lg:max-w-[min(54vw,980px)]",
                  showPreviewStrip ? "max-h-[72vh]" : "max-h-[82vh]"
                )}
                initial={{ opacity: 0, x: direction * 46, scale: 0.985 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * -46, scale: 0.985 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={activeSrc}
                  alt={`KVARC-S gallery ${(activeIndex ?? 0) + 1}`}
                  fill
                  sizes={galleryDetailImageSizes}
                  className="object-contain transition-transform duration-200"
                  quality={90}
                  priority
                  style={{ transform: `scale(${zoom})` }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Partners({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return partners;
    return partners.filter((partner) =>
      [
        partner.company,
        partner.phones.join(" "),
        partnerRegions.find((region) => region.key === partner.regionKey)?.title,
        partnerRegions.find((region) => region.key === partner.regionKey)?.country
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query]);
  const groupedPartners = useMemo(
    () =>
      partnerRegions
        .map((region) => ({
          region,
          items: filtered.filter((partner) => partner.regionKey === region.key)
        }))
        .filter((group) => group.items.length > 0),
    [filtered]
  );
  return (
    <section id="partners" className="py-24 pt-28">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-4xl text-center">
            <p className="eyebrow">{t.partners.eyebrow}</p>
            <h2 className="display-title mt-4 text-4xl leading-tight md:text-6xl">
              {t.partners.title}
            </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-semibold leading-8 text-[var(--text-secondary)]">
            {t.partners.body}
          </p>
        </Reveal>

        <label className="relative mx-auto mt-8 block max-w-xl">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            size={18}
          />
          <input
            className="focus-ring h-13 min-h-12 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] pl-11 pr-4 text-sm font-semibold text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
            value={query}
            placeholder={t.partners.search}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        {groupedPartners.length > 0 ? (
          <div className="mt-10 grid gap-8">
            {groupedPartners.map(({ region, items }) => (
              <div
                key={region.key}
                className="partner-region"
                style={{ "--partner-accent": region.accent } as CSSProperties}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-10 bg-[var(--partner-accent)]" aria-hidden="true" />
                  <h3 className="display-title text-3xl leading-tight md:text-4xl">
                    {region.title}
                  </h3>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((partner) => (
                    <article
                      key={`${partner.regionKey}-${partner.company}`}
                      className="partner-card rounded-stone p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
                    >
                      <div className="flex min-h-[86px] items-center gap-4">
                        <div className="partner-logo-frame relative grid h-16 w-24 shrink-0 place-items-center rounded-[8px] p-3">
                          <Image
                            src={partner.logo.dark}
                            alt=""
                            fill
                            sizes="96px"
                            unoptimized
                            className="partner-logo-dark object-contain p-3"
                          />
                          <Image
                            src={partner.logo.light}
                            alt=""
                            fill
                            sizes="96px"
                            unoptimized
                            className="partner-logo-light object-contain p-3"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-lg font-extrabold leading-6">
                            {partner.company}
                          </h4>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2">
                        {partner.phones.map((phone) => (
                          <a
                            key={phone}
                            className="focus-ring partner-phone-link inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-extrabold transition"
                            href={telHref(phone)}
                          >
                            <Phone size={16} />
                            {phone}
                          </a>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="surface mt-6 rounded-stone p-10 text-center text-[var(--text-secondary)]">
            {t.partners.empty}
          </div>
        )}
      </div>
    </section>
  );
}

function Contacts({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section id="contacts" className="py-24">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-4xl text-center">
            <p className="eyebrow">{t.contacts.eyebrow}</p>
            <h2 className="display-title mt-4 text-4xl leading-tight md:text-6xl">
              {t.contacts.title}
            </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[var(--text-secondary)]">
            {t.contacts.body}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.82fr_1fr]">
          <Reveal className="grid content-start gap-4">
            <ContactCard icon={<Phone size={22} />} label={t.contacts.phoneLabel}>
              <a href={telHref(contact.phone)}>
                {contact.phone}
                <span className="font-semibold text-[var(--text-secondary)]"> — {contact.phonePerson}</span>
              </a>
            </ContactCard>
            <ContactCard icon={<Mail size={22} />} label={t.contacts.email}>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </ContactCard>
            <ContactCard icon={<MapPin size={22} />} label="Офис">
              <span>{t.contacts.address}</span>
            </ContactCard>
            <ContactCard icon={<Clock size={22} />} label={t.contacts.hours}>
              <span>
                {t.contacts.weekdays}
                <span className="block">{t.contacts.weekend}</span>
              </span>
            </ContactCard>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-red-500 px-5 font-extrabold text-white shadow-[0_22px_60px_-30px_rgba(239,68,68,0.95)] transition hover:bg-red-600"
                href={contact.telegramChannel}
                target="_blank"
                rel="noreferrer"
              >
                <TelegramIcon size={19} />
                {lang === "ru" ? "Telegram канал" : "Telegram kanal"}
              </a>
              <a
                className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 font-extrabold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <Instagram size={19} />
                Instagram
              </a>
            </div>
          </Reveal>

          <Reveal className="surface overflow-hidden rounded-stone shadow-[var(--shadow-soft)]">
            <div className="relative min-h-[520px]">
              <iframe
                className="h-full min-h-[520px] w-full border-0"
                src={contact.mapEmbed}
                title="KVARC-S на Яндекс.Картах"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  label,
  children
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="surface rounded-stone p-4">
      <div className="grid grid-cols-[44px_1fr] gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] text-[var(--accent)]">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {label}
          </p>
          <div className="mt-1 break-words text-base font-extrabold text-[var(--text-primary)] [&_a:hover]:text-[var(--accent)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang];

  return (
    <footer className="border-y border-[var(--border)] bg-[var(--surface)] py-14">
      <div className="section-shell grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <a
            className="focus-ring relative block h-16 w-48"
            href="/"
            aria-label="KVARC-S"
          >
            <LogoImage theme={theme} className="object-left" />
          </a>
          <p className="mt-5 max-w-xs text-base font-semibold leading-7 text-[var(--text-secondary)]">
            Продажа кварцевого агломерата
          </p>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {t.contacts.phoneLabel}
          </p>
          <a className="mt-3 block text-lg font-extrabold hover:text-[var(--accent)]" href={telHref(contact.phone)}>
            {contact.phone}
          </a>
          <a className="mt-2 block text-lg font-extrabold hover:text-[var(--accent)]" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Офис
          </p>
          <p className="mt-3 text-lg font-semibold leading-7 text-[var(--text-secondary)]">
            {t.contacts.address}
          </p>
          <p className="mt-3 text-base font-semibold leading-7 text-[var(--text-secondary)]">
            {t.contacts.weekdays}
            <br />
            {t.contacts.weekend}
          </p>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Соцсети
          </p>
          <div className="mt-4 flex gap-3">
            <a
              className="focus-ring grid h-14 w-14 place-items-center rounded-full border border-[var(--border)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              href={contact.telegramChannel}
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
            >
              <TelegramIcon size={22} />
            </a>
            <a
              className="focus-ring grid h-14 w-14 place-items-center rounded-full border border-[var(--border)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              href={contact.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={22} />
            </a>
          </div>
        </div>
      </div>
      <div className="section-shell mt-10 flex flex-col gap-2 border-t border-[var(--border)] pt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} KVARC-S · основано в 2007 году</p>
        <p>kvarcs.uz</p>
      </div>
    </footer>
  );
}

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
