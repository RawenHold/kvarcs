export type PartnerRegionKind = "tashkent" | "uzbekistan-region" | "foreign";

export type PartnerRegion = {
  key: string;
  title: string;
  country: string;
  kind: PartnerRegionKind;
  accent: string;
};

export type Partner = {
  company: string;
  phones: string[];
  regionKey: string;
  logo: {
    light: string;
    dark: string;
  };
};

const logo = (fileName: string) => {
  const encoded = encodeURIComponent(`${fileName}.svg`);

  return {
    light: `/partners/light/${encoded}`,
    dark: `/partners/dark/${encoded}`
  };
};

export const partnerRegions: PartnerRegion[] = [
  {
    key: "tashkent",
    title: "Ташкент",
    country: "Узбекистан",
    kind: "tashkent",
    accent: "#b8894a"
  },
  {
    key: "samarkand",
    title: "Самарканд",
    country: "Узбекистан",
    kind: "uzbekistan-region",
    accent: "#7f9771"
  },
  {
    key: "tajikistan",
    title: "Таджикистан",
    country: "Таджикистан",
    kind: "foreign",
    accent: "#6f8fa8"
  },
  {
    key: "kyrgyzstan",
    title: "Киргизия",
    country: "Киргизия",
    kind: "foreign",
    accent: "#9a7b63"
  },
  {
    key: "moscow",
    title: "Москва",
    country: "Россия",
    kind: "foreign",
    accent: "#8d829f"
  }
];

export const partners: Partner[] = [
  {
    company: "Территория кварца",
    phones: ["+998 97 470 8189"],
    regionKey: "tashkent",
    logo: logo("Territoriya Kvartsa")
  },
  {
    company: "Quartzstone.uz",
    phones: ["+998 90 357 0809"],
    regionKey: "tashkent",
    logo: logo("Quartzstone.uz")
  },
  {
    company: "ProStone",
    phones: ["+998 90 347 0100"],
    regionKey: "tashkent",
    logo: logo("ProStone")
  },
  {
    company: "Art-Kvarc Stone",
    phones: ["+998 99 498 9955"],
    regionKey: "tashkent",
    logo: logo("Art-Kvarc Stone")
  },
  {
    company: "Planet Stone",
    phones: ["+998 97 747 3604"],
    regionKey: "tashkent",
    logo: logo("Planet Stone")
  },
  {
    company: "LM Stones",
    phones: ["+998 90 109 9955"],
    regionKey: "tashkent",
    logo: logo("LM Stones")
  },
  {
    company: "Special Stoneza",
    phones: ["+998 33 377 4471"],
    regionKey: "tashkent",
    logo: logo("Special Stoneza")
  },
  {
    company: "Humo Kamen",
    phones: ["+998 90 168 7474"],
    regionKey: "tashkent",
    logo: logo("Humo Kamen")
  },
  {
    company: "Kuhni Kvarc",
    phones: ["+998 97 839 8888"],
    regionKey: "tashkent",
    logo: logo("Kuhni Kvarc")
  },
  {
    company: "TS",
    phones: ["+998 97 706 8833"],
    regionKey: "tashkent",
    logo: logo("TS")
  },
  {
    company: "Будилов",
    phones: ["+998 97 703 2404"],
    regionKey: "tashkent",
    logo: logo("Budilov")
  },
  {
    company: "Stone House",
    phones: ["+998 90 998 2270"],
    regionKey: "tashkent",
    logo: logo("Stone House")
  },
  {
    company: "Azia Stone",
    phones: ["+998 33 804 1200"],
    regionKey: "tashkent",
    logo: logo("Azia Stone")
  },
  {
    company: "Tosch",
    phones: ["+998 98 555 8988"],
    regionKey: "tashkent",
    logo: logo("Tosch")
  },
  {
    company: "Mir Stone",
    phones: ["+998 97 420 5459"],
    regionKey: "tashkent",
    logo: logo("Mir Stone")
  },
  {
    company: "Цех",
    phones: ["+998 90 977 5947"],
    regionKey: "tashkent",
    logo: logo("Tsekh")
  },
  {
    company: "MasterStone.Uz",
    phones: ["+998 90 934 3834"],
    regionKey: "tashkent",
    logo: logo("MasterStone.Uz")
  },
  {
    company: "Mercury Group",
    phones: ["+998 90 915 1324"],
    regionKey: "tashkent",
    logo: logo("Mercury Group")
  },
  {
    company: "Beautiful Stone",
    phones: ["+998 99 790 5500"],
    regionKey: "tashkent",
    logo: logo("Beautiful Stone")
  },
  {
    company: "Vivat Mebel",
    phones: ["+998 90 948 9665"],
    regionKey: "tashkent",
    logo: logo("Vivat Mebel")
  },
  {
    company: "T.A.R. Kvarc",
    phones: ["+998 97 705 7522"],
    regionKey: "tashkent",
    logo: logo("T.A.R. Kvarc")
  },
  {
    company: "Ladi Kristal",
    phones: ["+998 97 333 9261"],
    regionKey: "tashkent",
    logo: logo("Ladi Kristal")
  },
  {
    company: "ATR Garmoniya",
    phones: ["+998 90 347 3088"],
    regionKey: "tashkent",
    logo: logo("ATR Garmoniya")
  },
  {
    company: "DecoLit",
    phones: ["+998 90 980 8750"],
    regionKey: "tashkent",
    logo: logo("DecoLit")
  },
  {
    company: "Real Stone",
    phones: ["+998 99 821 4499"],
    regionKey: "tashkent",
    logo: logo("Real Stone")
  },
  {
    company: "Strong Stone",
    phones: ["+998 94 614 5774"],
    regionKey: "tashkent",
    logo: logo("Strong Stone")
  },
  {
    company: "СтолМастер",
    phones: ["+998 33 321 5533"],
    regionKey: "samarkand",
    logo: logo("StolMaster")
  },
  {
    company: "Namuna",
    phones: ["+998 95 844 5555"],
    regionKey: "samarkand",
    logo: logo("Namuna")
  },
  {
    company: "Ideal Granit",
    phones: ["+998 97 912 7577"],
    regionKey: "samarkand",
    logo: logo("Ideal Granit")
  },
  {
    company: "Mondelux",
    phones: ["+998 78 122 3030"],
    regionKey: "samarkand",
    logo: logo("Mondelux")
  },
  {
    company: "Kvars.uz",
    phones: ["+998 90 936 9293"],
    regionKey: "samarkand",
    logo: logo("Kvars.uz")
  },
  {
    company: "Sang",
    phones: ["+992 90 428 1199"],
    regionKey: "tajikistan",
    logo: logo("Sang")
  },
  {
    company: "KS",
    phones: ["+996 700 532 626"],
    regionKey: "kyrgyzstan",
    logo: logo("KS")
  },
  {
    company: "Gemstone",
    phones: ["+7 915 136 0897"],
    regionKey: "moscow",
    logo: logo("Gemstone")
  }
];
