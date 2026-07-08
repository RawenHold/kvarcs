export type Lang = "ru" | "uz";

export const translations = {
  ru: {
    languageName: "Русский",
    nav: {
      catalog: "Каталог",
      services: "Услуги",
      portfolio: "Портфолио",
      partners: "Обработчики камня",
      about: "О компании",
      contacts: "Контакты"
    },
    common: {
      call: "Позвонить",
      write: "Написать",
      price: "Узнать цену",
      details: "Подробнее",
      view: "Смотреть",
      close: "Закрыть",
      all: "Все",
      openMap: "Открыть в Яндекс.Картах"
    },
    hero: {
      label: "Кварцевый агломерат в Ташкенте",
      title: "Поверхности из кварца для кухни, ванной и коммерческих зон",
      lead: "Прочные плиты KVARC-S с доставкой, гарантией и подбором обработчика.",
      benefits: ["Быстрая доставка", "Гарантия качества 15 лет", "Приемлемые цены", "Работаем с 2007 года"],
      scroll: "Листайте"
    },
    about: {
      eyebrow: "Материал и контроль",
      title: "Поверхность для кухни, ванной и коммерческих зон на каждый день.",
      body: "Кварцевый агломерат KVARC-S рассчитан на кухни, подоконники, стойки, санузлы и коммерческие зоны. В каталоге видна фактура, размеры плиты и контакты для расчёта без лишней витрины.",
      stats: [
        { label: "коллекция камня", suffix: "+" },
        { label: "партнёров по обработке", suffix: "" },
        { label: "Гарантия качества", suffix: " лет." }
      ]
    },
    catalog: {
      eyebrow: "Каталог KVARC-S",
      title: "30 фактур для поверхностей, которые видят каждый день.",
      body: "Смотрите коллекции в компактной сетке или списком. В карточке — фактура, размеры плиты и заявка на расчёт.",
      search: "Поиск по названию",
      list: "Список",
      grid: "Сетка 3×3",
      tone: "Тон",
      pattern: "Рисунок",
      noResults: "По этому запросу коллекций не найдено.",
      selectedStone: "Выбранная коллекция"
    },
    tones: {
      dark: "Тёмные",
      light: "Светлые",
      medium: "Средние"
    },
    patterns: {
      solid: "Однотонные",
      veined: "С прожилками",
      marble: "Мраморные",
      sparkle: "С блёстками"
    },
    specs: {
      width: "Ширина",
      height: "Высота",
      thickness: "Толщина",
      surface: "Поверхность",
      area: "м² в плите"
    },
    services: {
      eyebrow: "Полный цикл",
      title: "Обработчик доводит плиту до готового изделия.",
      body: "Партнёры KVARC-S закрывают путь от выезда с образцами до установки на объекте.",
      steps: ["Выезд на объект с образцами", "Замер изделия", "Просчёт стоимости", "Изготовление изделия", "Доставка на объект", "Установка изделия"]
    },
    partners: {
      eyebrow: "Партнёры",
      title: "Каталог обработчиков камня",
      body: "Каждый партнёр предоставляет полный цикл услуг: от выезда с образцами до финального монтажа.",
      search: "Найти компанию или контакт",
      empty: "Партнёры по этому запросу не найдены."
    },
    contacts: {
      eyebrow: "Контакты",
      title: "Свяжитесь с нами",
      body: "Позвоните, напишите в Telegram или приезжайте в офис KVARC-S в Ташкенте.",
      phoneLabel: "Телефон",
      telegram: "Telegram",
      instagram: "Instagram",
      email: "Email",
      address: "г. Ташкент, ул. Чиланзарская, 55",
      hours: "Режим работы",
      weekdays: "Пн–Пт: 9:00–20:00",
      weekend: "Сб–Вс: 10:00–19:00",
      open: "Открыто сейчас",
      closed: "Сейчас закрыто",
      formName: "Имя",
      formPhone: "Телефон",
      formComment: "Комментарий",
      formSubmit: "Отправить",
      formSending: "Отправляем...",
      formSuccess: "Заявка отправлена. Мы свяжемся с вами.",
      formValidationError: "Укажите имя и телефон.",
      formConfigError: "Telegram для заявок ещё не настроен. Напишите нам напрямую.",
      formError: "Не удалось отправить заявку. Напишите нам в Telegram."
    },
    footer: {
      text: "Кварцевый агломерат для столешниц, подоконников, стоек и интерьерных поверхностей в Ташкенте."
    }
  },
  uz: {
    languageName: "O‘zbekcha",
    nav: {
      catalog: "Katalog",
      services: "Xizmatlar",
      portfolio: "Portfolio",
      partners: "Tosh ustalari",
      about: "Kompaniya",
      contacts: "Kontaktlar"
    },
    common: {
      call: "Qo‘ng‘iroq qilish",
      write: "Yozish",
      price: "Narxni bilish",
      details: "Batafsil",
      view: "Ko‘rish",
      close: "Yopish",
      all: "Barchasi",
      openMap: "Yandex xaritada ochish"
    },
    hero: {
      label: "Toshkentda kvars aglomerat",
      title: "Oshxona, vanna va tijorat zonalari uchun kvars sirtlar",
      lead: "Yetkazib berish, kafolat va ishlov beruvchi ustani tanlash bilan mustahkam KVARC-S plitalari.",
      benefits: ["Tez yetkazib berish", "Sifat kafolati 15 yil", "Ma‘qul narxlar", "2007 yildan buyon ishlaymiz"],
      scroll: "Pastga"
    },
    about: {
      eyebrow: "Material va nazorat",
      title: "Har kungi foydalanishga chidamli sirt.",
      body: "KVARC-S kvars aglomerati oshxona, deraza tokchasi, stoyka, vanna xonasi va savdo zonalari uchun mos. Katalogda faktura, plita o‘lchamlari va hisob-kitob uchun kontaktlar aniq ko‘rsatilgan.",
      stats: [
        { label: "tosh kolleksiyasi", suffix: "+" },
        { label: "ishlov beruvchi hamkor", suffix: "" },
        { label: "Sifat kafolati", suffix: " yil." }
      ]
    },
    catalog: {
      eyebrow: "KVARC-S katalogi",
      title: "Har kuni ko‘rinadigan yuzalar uchun 30 faktura.",
      body: "Kolleksiyalarni ixcham setka yoki ro‘yxatda ko‘ring. Kartochkada faktura, plita o‘lchamlari va hisob-kitob uchun ariza bor.",
      search: "Nomi bo‘yicha qidirish",
      list: "Ro‘yxat",
      grid: "3×3 setka",
      tone: "Ton",
      pattern: "Chizma",
      noResults: "Bu so‘rov bo‘yicha kolleksiya topilmadi.",
      selectedStone: "Tanlangan kolleksiya"
    },
    tones: {
      dark: "To‘q",
      light: "Yorqin",
      medium: "O‘rta"
    },
    patterns: {
      solid: "Bir xil",
      veined: "Tomirli",
      marble: "Marmar",
      sparkle: "Yaltiroq"
    },
    specs: {
      width: "Kenglik",
      height: "Balandlik",
      thickness: "Qalinlik",
      surface: "Sirt",
      area: "plitadagi m²"
    },
    services: {
      eyebrow: "To‘liq sikl",
      title: "Usta plitani tayyor buyumga aylantiradi.",
      body: "KVARC-S hamkorlari namunalar bilan chiqishdan obyektga o‘rnatishgacha bo‘lgan jarayonni bajaradi.",
      steps: ["Namunalar bilan obyektga chiqish", "Buyumni o‘lchash", "Narxni hisoblash", "Buyumni tayyorlash", "Obyektga yetkazish", "O‘rnatish"]
    },
    partners: {
      eyebrow: "Hamkorlar",
      title: "Toshga ishlov beruvchilar katalogi",
      body: "Har bir hamkor namunalar bilan chiqishdan yakuniy montajgacha to‘liq xizmat ko‘rsatadi.",
      search: "Kompaniya yoki kontaktni qidirish",
      empty: "Bu so‘rov bo‘yicha hamkor topilmadi."
    },
    contacts: {
      eyebrow: "Kontaktlar",
      title: "Biz bilan bog'laning",
      body: "Qo'ng'iroq qiling, Telegram orqali yozing yoki Toshkentdagi KVARC-S ofisiga keling.",
      phoneLabel: "Telefon",
      telegram: "Telegram",
      instagram: "Instagram",
      email: "Email",
      address: "Toshkent shahri, Chilonzor ko‘chasi, 55",
      hours: "Ish vaqti",
      weekdays: "Du–Ju: 9:00–20:00",
      weekend: "Sh–Ya: 10:00–19:00",
      open: "Hozir ochiq",
      closed: "Hozir yopiq",
      formName: "Ism",
      formPhone: "Telefon",
      formComment: "Izoh",
      formSubmit: "Yuborish",
      formSending: "Yuborilmoqda...",
      formSuccess: "Ariza yuborildi. Siz bilan bog‘lanamiz.",
      formValidationError: "Ism va telefonni kiriting.",
      formConfigError: "Telegram arizalar uchun hali sozlanmagan. Bizga to‘g‘ridan-to‘g‘ri yozing.",
      formError: "Arizani yuborib bo‘lmadi. Telegram orqali yozing."
    },
    footer: {
      text: "Toshkentda stoleshnitsa, deraza tokchasi, stoyka va interyer yuzalari uchun kvars aglomerat."
    }
  }
} as const;
