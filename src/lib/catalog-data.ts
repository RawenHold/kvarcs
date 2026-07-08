import type { Lang } from "./translations";

export type StoneTone = "dark" | "light" | "medium";
export type StonePattern = "solid" | "veined" | "marble" | "sparkle";

export type Stone = {
  number: number;
  name: string;
  slug: string;
  image: string;
  detailImages?: string[];
  tone: StoneTone;
  pattern: StonePattern;
  surface: {
    ru: string;
    uz: string;
  };
  specs: {
    widthMm: number;
    heightMm: number;
    thicknessMm: number;
    areaM2: number;
  };
  description: Record<Lang, string>;
};

const defaultSpecs = {
  widthMm: 1600,
  heightMm: 3200,
  thicknessMm: 15,
  areaM2: 5.12
};

const semiGloss = {
  ru: "полуглянцевая",
  uz: "yarim yaltiroq"
};

const matte = {
  ru: "матовая",
  uz: "mat"
};

const faceSlugs = new Set([
  "cotton",
  "ink-rhythm",
  "cloud",
  "starry-night",
  "amber",
  "golden-faith",
  "gray",
  "golden-calacatta",
  "white-cliff",
  "snowflakes-cement",
  "sparkle-sky",
  "jet-black",
  "grey-calacatta",
  "onyx",
  "lanes",
  "ocean"
]);

type StoneSeed = {
  number: number;
  name: string;
  tone: StoneTone;
  pattern: StonePattern;
  surface?: typeof semiGloss;
  thicknessMm?: number;
};

const catalogSeeds: StoneSeed[] = [
  { number: 1, name: "GALAXY BLACK", tone: "dark", pattern: "sparkle" },
  { number: 2, name: "COTTON", tone: "light", pattern: "solid" },
  { number: 3, name: "INK RHYTHM", tone: "dark", pattern: "veined" },
  { number: 4, name: "CARRARA BROWN", tone: "medium", pattern: "marble" },
  { number: 5, name: "CLOUD", tone: "light", pattern: "solid" },
  { number: 6, name: "STARRY NIGHT", tone: "dark", pattern: "sparkle" },
  { number: 7, name: "AMBER", tone: "medium", pattern: "solid" },
  { number: 9, name: "GOLDEN FAITH", tone: "medium", pattern: "marble" },
  { number: 10, name: "GRAY", tone: "medium", pattern: "solid" },
  { number: 11, name: "BLACK CALACATTA", tone: "dark", pattern: "marble", thicknessMm: 20 },
  { number: 12, name: "GOLDEN CALACATTA", tone: "light", pattern: "marble", thicknessMm: 20 },
  { number: 14, name: "WHITE CLIFF", tone: "light", pattern: "sparkle" },
  { number: 15, name: "SNOWFLAKES CEMENT", tone: "light", pattern: "solid", surface: matte },
  { number: 17, name: "SPARKLE SKY", tone: "dark", pattern: "sparkle" },
  { number: 19, name: "JET BLACK", tone: "dark", pattern: "solid" },
  { number: 20, name: "GREY CALACATTA", tone: "medium", pattern: "marble" },
  { number: 21, name: "ONYX", tone: "dark", pattern: "veined" },
  { number: 22, name: "LANES", tone: "light", pattern: "veined" },
  { number: 24, name: "COASTAL", tone: "light", pattern: "solid" },
  { number: 25, name: "DARK ICE", tone: "dark", pattern: "solid" },
  { number: 26, name: "OCEAN", tone: "medium", pattern: "veined" },
  { number: 27, name: "MISTERY", tone: "medium", pattern: "veined" },
  { number: 28, name: "OBSIDIAN", tone: "dark", pattern: "veined" },
  { number: 29, name: "CASTILLO", tone: "medium", pattern: "marble" },
  { number: 30, name: "ABSOLUT", tone: "light", pattern: "solid" },
  { number: 32, name: "SAVANNAH", tone: "medium", pattern: "solid" },
  { number: 33, name: "CEMENTUM DRIFT", tone: "medium", pattern: "solid", surface: matte },
  { number: 35, name: "EXTRA", tone: "light", pattern: "solid" },
  { number: 36, name: "AQUAMARINE", tone: "medium", pattern: "veined" },
  { number: 38, name: "CLASSIC", tone: "light", pattern: "solid" }
];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function pad(number: number) {
  return number.toString().padStart(2, "0");
}

function description(seed: StoneSeed): Record<Lang, string> {
  const toneRu: Record<StoneTone, string> = {
    dark: "тёмная",
    light: "светлая",
    medium: "средняя по тону"
  };
  const patternRu: Record<StonePattern, string> = {
    solid: "спокойной фактурой",
    veined: "выразительными прожилками",
    marble: "мраморным рисунком",
    sparkle: "кристаллическими включениями"
  };
  const toneUz: Record<StoneTone, string> = {
    dark: "to'q",
    light: "yorqin",
    medium: "o'rtacha tusdagi"
  };
  const patternUz: Record<StonePattern, string> = {
    solid: "sokin fakturali",
    veined: "ifodali tomirli",
    marble: "marmar chizmali",
    sparkle: "kristall yaltirashli"
  };

  return {
    ru: `${seed.name} — ${toneRu[seed.tone]} кварцевая плита с ${patternRu[seed.pattern]} для столешниц, островов, подоконников, ванных и коммерческих зон.`,
    uz: `${seed.name} — stoleshnitsa, orol, deraza tokchasi, vanna va tijorat zonalari uchun ${toneUz[seed.tone]} ${patternUz[seed.pattern]} kvars plita.`
  };
}

export const stones: Stone[] = catalogSeeds.map((seed) => {
  const slug = slugify(seed.name);
  const image = `/catalog/${pad(seed.number)}-${slug}.jpg`;
  const detailImages = faceSlugs.has(slug) ? [`/catalog-face/${slug}.png`, image] : undefined;

  return {
    number: seed.number,
    name: seed.name,
    slug,
    image,
    detailImages,
    tone: seed.tone,
    pattern: seed.pattern,
    surface: seed.surface ?? semiGloss,
    specs: {
      ...defaultSpecs,
      thicknessMm: seed.thicknessMm ?? defaultSpecs.thicknessMm
    },
    description: description(seed)
  };
});
