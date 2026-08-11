import type { Locale } from "@/lib/i18n";

export const appSlugs = ["love-mailbox", "paw-love", "unseal"] as const;
export type AppSlug = (typeof appSlugs)[number];

type AppOrigin = `https://${string}.justours.love` | `http://127.0.0.1:${number}`;

const unsealOrigin: AppOrigin = process.env.NODE_ENV === "development"
  ? "http://127.0.0.1:3413"
  : "https://unseal.justours.love";
const loveMailboxOrigin: AppOrigin = process.env.NODE_ENV === "development"
  ? "http://127.0.0.1:3411"
  : "https://mailbox.justours.love";

type AppCopy = {
  name: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  description: string;
  launchLabel: string;
  previewLabel: string;
  unavailableLabel: string;
  imageAlt: readonly [string, string, string];
};

type AppMedia = {
  poster: string;
  gallery: readonly [string, string, string];
};

export type AppDefinition = {
  slug: AppSlug;
  number: string;
  liveUrl: AppOrigin;
  embedUrl: `${AppOrigin}/demo`;
  origin: AppOrigin;
  media: Record<Locale, AppMedia>;
  accent: string;
  content: Record<Locale, AppCopy>;
};

export const apps = [
  {
    slug: "love-mailbox",
    number: "01",
    liveUrl: loveMailboxOrigin,
    embedUrl: `${loveMailboxOrigin}/demo`,
    origin: loveMailboxOrigin,
    media: {
      uk: { poster: "/real/love-mailbox-01.jpg", gallery: ["/real/love-mailbox-01.jpg", "/real/love-mailbox-02.jpg", "/real/love-mailbox-03.jpg"] },
      ru: { poster: "/real/love-mailbox-01-ru.jpg", gallery: ["/real/love-mailbox-01-ru.jpg", "/real/love-mailbox-02-ru.jpg", "/real/love-mailbox-03.jpg"] },
      en: { poster: "/real/love-mailbox-01-en.jpg", gallery: ["/real/love-mailbox-01-en.jpg", "/real/love-mailbox-02-en.jpg", "/real/love-mailbox-03.jpg"] },
    },
    accent: "#b97762",
    content: {
      uk: {
        name: "Love Mailbox",
        eyebrow: "Скринька теплих слів",
        tagline: "Листи, які хочеться відкривати знову",
        summary: "Віртуальна поштова скринька, наповнена маленькими листами для особливої людини.",
        description: "Напишіть кілька теплих листів, складіть їх у придорожню скриньку й надішліть приватне посилання. Кожне натискання відкриває ще одне зізнання.",
        launchLabel: "Наповнити скриньку",
        previewLabel: "Відкрити скриньку",
        unavailableLabel: "Скринька зараз не відкрилася. Повну історію можна запустити напряму.",
        imageAlt: ["Початковий екран Love Mailbox із запечатаним листом", "Справжня сцена поштової скриньки Love Mailbox", "Детальна ілюстрація поштової скриньки з листами"],
      },
      ru: {
        name: "Love Mailbox",
        eyebrow: "Ящик тёплых слов",
        tagline: "Письма, которые хочется открывать снова",
        summary: "Виртуальный почтовый ящик, наполненный маленькими письмами для особенного человека.",
        description: "Напишите несколько тёплых писем, сложите их в придорожный ящик и отправьте приватную ссылку. Каждое нажатие открывает ещё одно признание.",
        launchLabel: "Наполнить ящик",
        previewLabel: "Открыть ящик",
        unavailableLabel: "Ящик сейчас не открылся. Полную историю можно запустить напрямую.",
        imageAlt: ["Начальный экран Love Mailbox с запечатанным письмом", "Настоящая сцена почтового ящика Love Mailbox", "Детальная иллюстрация почтового ящика с письмами"],
      },
      en: {
        name: "Love Mailbox",
        eyebrow: "A mailbox of warm words",
        tagline: "Letters worth opening again",
        summary: "A virtual roadside mailbox filled with little letters for someone special.",
        description: "Write a handful of warm letters, tuck them into a roadside mailbox, and share a private link. Every tap reveals another confession.",
        launchLabel: "Fill the mailbox",
        previewLabel: "Open the mailbox",
        unavailableLabel: "The mailbox did not open this time. You can still launch the full story.",
        imageAlt: ["Love Mailbox opening screen with a sealed letter", "The real Love Mailbox roadside scene", "Detailed mailbox illustration filled with letters"],
      },
    },
  },
  {
    slug: "paw-love",
    number: "02",
    liveUrl: "https://paw.justours.love",
    embedUrl: "https://paw.justours.love/demo",
    origin: "https://paw.justours.love",
    media: {
      uk: { poster: "/real/paw-love-01.jpg", gallery: ["/real/paw-love-01.jpg", "/real/paw-love-02.jpg", "/real/paw-love-03.jpg"] },
      ru: { poster: "/real/paw-love-01-ru.jpg", gallery: ["/real/paw-love-01-ru.jpg", "/real/paw-love-02-ru.jpg", "/real/paw-love-03-ru.jpg"] },
      en: { poster: "/real/paw-love-01-en.jpg", gallery: ["/real/paw-love-01-en.jpg", "/real/paw-love-02-en.jpg", "/real/paw-love-03-en.jpg"] },
    },
    accent: "#e9b88f",
    content: {
      uk: {
        name: "Paw Love",
        eyebrow: "Голос, що поруч",
        tagline: "Твої слова. Їхня усмішка.",
        summary: "Особистий голосовий сюрприз із теплими словами, лапками й власною інтонацією.",
        description: "Запишіть ім’я та улюблені звертання, складіть маленьку виставу й надішліть приватне посилання тому, кого хочеться обійняти.",
        launchLabel: "Створити Paw Love",
        previewLabel: "Почути прев’ю",
        unavailableLabel: "Прев’ю зараз відпочиває. Відкрийте застосунок напряму.",
        imageAlt: ["Початковий екран сюрпризу Paw Love", "Справжня дошка компліментів Paw Love", "Романтичний рядок, складений у Paw Love"],
      },
      ru: {
        name: "Paw Love",
        eyebrow: "Голос, который рядом",
        tagline: "Твои слова. Их улыбка.",
        summary: "Личный голосовой сюрприз с тёплыми словами, лапками и вашей интонацией.",
        description: "Запишите имя и любимые обращения, соберите маленькое представление и отправьте приватную ссылку тому, кого хочется обнять.",
        launchLabel: "Создать Paw Love",
        previewLabel: "Послушать превью",
        unavailableLabel: "Превью сейчас отдыхает. Откройте приложение напрямую.",
        imageAlt: ["Начальный экран сюрприза Paw Love", "Настоящая доска комплиментов Paw Love", "Романтическая строка, составленная в Paw Love"],
      },
      en: {
        name: "Paw Love",
        eyebrow: "A voice that feels close",
        tagline: "Your words. Their smile.",
        summary: "A personal voice surprise filled with warm words, tiny paws, and your own intonation.",
        description: "Record their name and your favorite words, arrange a tiny performance, and send a private link to the person you wish you could hug.",
        launchLabel: "Create a Paw Love",
        previewLabel: "Hear the preview",
        unavailableLabel: "The preview is taking a little nap. Open the app directly instead.",
        imageAlt: ["Paw Love surprise opening screen", "The real Paw Love compliment board", "A romantic line composed in Paw Love"],
      },
    },
  },
  {
    slug: "unseal",
    number: "03",
    liveUrl: unsealOrigin,
    embedUrl: `${unsealOrigin}/demo`,
    origin: unsealOrigin,
    media: {
      uk: { poster: "/real/unseal-01.jpg", gallery: ["/real/unseal-01.jpg", "/real/unseal-02.jpg", "/real/unseal-03.jpg"] },
      ru: { poster: "/real/unseal-01-ru.jpg", gallery: ["/real/unseal-01-ru.jpg", "/real/unseal-02-ru.jpg", "/real/unseal-03-ru.jpg"] },
      en: { poster: "/real/unseal-01-en.jpg", gallery: ["/real/unseal-01-en.jpg", "/real/unseal-02-en.jpg", "/real/unseal-03-en.jpg"] },
    },
    accent: "#c78592",
    content: {
      uk: {
        name: "Unseal",
        eyebrow: "Історія за п’ятьма замками",
        tagline: "Деякі слова варто відкривати повільно",
        summary: "Інтерактивна листівка, де кожен замок наближає до того, що давно хотілося сказати.",
        description: "Оберіть слова, музику та фінальне послання. Unseal перетворить їх на камерну подорож усередину серця.",
        launchLabel: "Створити Unseal",
        previewLabel: "Відкрити прев’ю",
        unavailableLabel: "Прев’ю не відкрилося, але повна історія чекає в застосунку.",
        imageAlt: ["Серце Unseal", "П’ять замків листівки Unseal", "Фінальна сцена всередині серця"],
      },
      ru: {
        name: "Unseal",
        eyebrow: "История за пятью замками",
        tagline: "Некоторые слова стоит открывать медленно",
        summary: "Интерактивная открытка, где каждый замок приближает к тому, что давно хотелось сказать.",
        description: "Выберите слова, музыку и финальное послание. Unseal превратит их в камерное путешествие внутрь сердца.",
        launchLabel: "Создать Unseal",
        previewLabel: "Открыть превью",
        unavailableLabel: "Превью не открылось, но полная история ждёт в приложении.",
        imageAlt: ["Сердце Unseal", "Пять замков открытки Unseal", "Финальная сцена внутри сердца"],
      },
      en: {
        name: "Unseal",
        eyebrow: "A story behind five locks",
        tagline: "Some words deserve to be opened slowly",
        summary: "An interactive card where every lock brings you closer to what you have wanted to say.",
        description: "Choose the words, music, and final message. Unseal turns them into an intimate journey inside the heart.",
        launchLabel: "Create an Unseal",
        previewLabel: "Open the preview",
        unavailableLabel: "The preview did not open, but the full story is waiting in the app.",
        imageAlt: ["Unseal heart", "Five locks on an Unseal card", "Final scene inside the heart"],
      },
    },
  },
] as const satisfies readonly AppDefinition[];

export function getApp(slug: string): AppDefinition | undefined {
  return apps.find((app) => app.slug === slug);
}
