import type { Locale } from "@/lib/i18n";

type SiteCopy = {
  navApps: string;
  navPrivacy: string;
  heroKicker: string;
  heroTitle: string;
  heroBody: string;
  heroCta: string;
  collectionLabel: string;
  collectionTitle: string;
  detailLabel: string;
  detailCta: string;
  finalKicker: string;
  finalTitle: string;
  finalBody: string;
  finalCta: string;
  back: string;
  previewTitle: string;
  galleryTitle: string;
  closePreview: string;
  loadingPreview: string;
  notFoundTitle: string;
  notFoundBack: string;
  privacyTitle: string;
  privacyBody: readonly string[];
};

export const siteCopy: Record<Locale, SiteCopy> = {
  uk: {
    navApps: "Застосунки", navPrivacy: "Приватність", heroKicker: "Створено для двох",
    heroTitle: "Ваше кохання. Ваші маленькі світи.",
    heroBody: "Три способи сказати важливе — у листах, власним голосом або крізь історію, яку хочеться відкривати повільно.",
    heroCta: "Знайти свій спосіб", collectionLabel: "Колекція Just Ours Love",
    collectionTitle: "Оберіть настрій. Решту ми перетворимо на момент.", detailLabel: "Дізнатися більше",
    detailCta: "Перейти до застосунку", finalKicker: "Just Ours Love",
    finalTitle: "Між вами вже є історія. Додайте їй ще одну сцену.",
    finalBody: "Оберіть застосунок і почніть із одного щирого жесту.", finalCta: "Повернутися до колекції",
    back: "Усі застосунки", previewTitle: "Живе прев’ю", galleryTitle: "Три моменти історії",
    closePreview: "Закрити прев’ю", loadingPreview: "Готуємо маленький світ…",
    notFoundTitle: "Цього маленького світу тут немає.", notFoundBack: "Назад до Just Ours Love",
    privacyTitle: "Приватність без дрібного шрифту",
    privacyBody: [
      "Just Ours Love використовує власну інсталяцію Umami для анонімної статистики переглядів і переходів. Ми не створюємо рекламних профілів і не передаємо ідентифікатори користувачів.",
      "Інтерактивні прев’ю містять лише демонстраційні дані. Вони не бачать ваших листівок, записів або приватних посилань.",
      "Кожен застосунок зберігає лише ті дані, які потрібні для створеної вами історії, за правилами, описаними всередині самого застосунку.",
    ],
  },
  ru: {
    navApps: "Приложения", navPrivacy: "Приватность", heroKicker: "Создано для двоих",
    heroTitle: "Ваша любовь. Ваши маленькие миры.",
    heroBody: "Три способа сказать важное — в письмах, собственным голосом или через историю, которую хочется открывать медленно.",
    heroCta: "Найти свой способ", collectionLabel: "Коллекция Just Ours Love",
    collectionTitle: "Выберите настроение. Остальное мы превратим в момент.", detailLabel: "Узнать больше",
    detailCta: "Перейти в приложение", finalKicker: "Just Ours Love",
    finalTitle: "Между вами уже есть история. Добавьте ей ещё одну сцену.",
    finalBody: "Выберите приложение и начните с одного искреннего жеста.", finalCta: "Вернуться к коллекции",
    back: "Все приложения", previewTitle: "Живое превью", galleryTitle: "Три момента истории",
    closePreview: "Закрыть превью", loadingPreview: "Готовим маленький мир…",
    notFoundTitle: "Этого маленького мира здесь нет.", notFoundBack: "Назад в Just Ours Love",
    privacyTitle: "Приватность без мелкого шрифта",
    privacyBody: [
      "Just Ours Love использует собственную установку Umami для анонимной статистики просмотров и переходов. Мы не создаём рекламных профилей и не передаём идентификаторы пользователей.",
      "Интерактивные превью содержат только демонстрационные данные. Они не видят ваши открытки, записи или приватные ссылки.",
      "Каждое приложение хранит только данные, необходимые для созданной вами истории, по правилам, описанным внутри самого приложения.",
    ],
  },
  en: {
    navApps: "Apps", navPrivacy: "Privacy", heroKicker: "Made for two",
    heroTitle: "Your love. Your little worlds.",
    heroBody: "Three ways to say what matters — in letters, in your own voice, or through a story worth opening slowly.",
    heroCta: "Find your way", collectionLabel: "The Just Ours Love collection",
    collectionTitle: "Choose the feeling. We’ll turn it into a moment.", detailLabel: "Discover the story",
    detailCta: "Open the app", finalKicker: "Just Ours Love",
    finalTitle: "You already have a story. Give it one more scene.",
    finalBody: "Choose an app and begin with one honest gesture.", finalCta: "Return to the collection",
    back: "All apps", previewTitle: "Live preview", galleryTitle: "Three moments in the story",
    closePreview: "Close preview", loadingPreview: "Preparing a little world…",
    notFoundTitle: "This little world isn’t here.", notFoundBack: "Back to Just Ours Love",
    privacyTitle: "Privacy, without the small print",
    privacyBody: [
      "Just Ours Love uses a self-hosted Umami instance for anonymous page and launch statistics. We do not create advertising profiles or send user identifiers.",
      "Interactive previews contain demonstration data only. They cannot see your cards, recordings, or private links.",
      "Each app stores only what its experience needs, according to the rules described inside that app.",
    ],
  },
};
