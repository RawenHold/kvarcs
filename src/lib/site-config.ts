export const siteConfig = {
  url: "https://kvarcs.uz",
  name: "KVARC-S",
  title: "KVARC-S - кварцевый агломерат в Ташкенте",
  description:
    "Поверхности из кварца для кухни, ванной и коммерческих зон. Прочные плиты KVARC-S с доставкой, гарантией и подбором обработчика.",
  keywords: [
    "KVARC-S",
    "кварцевый агломерат",
    "кварц Ташкент",
    "кварцевые плиты Ташкент",
    "столешницы из кварца",
    "кварцевая столешница",
    "камень для кухни",
    "барные стойки из кварца",
    "обработчики камня Ташкент",
    "kvarcs uz"
  ],
  ogImage: "/catalog/11-black-calacatta.jpg",
  phone: "+998 90 005 59 55",
  phonePerson: "Михаил",
  telegram: "https://t.me/kvarcS",
  instagram: "https://www.instagram.com/kvarcs.uz",
  email: "kvarcs.uz@yandex.ru",
  foundedYear: "2007",
  address: {
    ru: "г. Ташкент, ул. Чиланзарская, 55",
    uz: "Toshkent shahri, Chilonzor ko'chasi, 55",
    streetAddress: "ул. Чиланзарская, 55",
    addressLocality: "Ташкент",
    addressRegion: "Ташкент",
    addressCountry: "UZ"
  },
  geo: {
    latitude: 41.282174,
    longitude: 69.221327
  },
  map: "https://yandex.uz/maps/10335/tashkent/?ll=69.221168%2C41.282012&mode=poi&poi%5Bpoint%5D=69.221327%2C41.282174&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D60846045900&z=20.56",
  mapEmbed:
    "https://yandex.uz/map-widget/v1/?ll=69.221168%2C41.282012&mode=poi&poi%5Bpoint%5D=69.221327%2C41.282174&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D60846045900&z=20.56"
} as const;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return new URL(path.startsWith("/") ? path : `/${path}`, siteConfig.url).toString();
}
