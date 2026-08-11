export const locales = ["uk", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function localeFromAcceptLanguage(value: string | null): Locale {
  if (!value) return defaultLocale;
  const requested = value
    .toLowerCase()
    .split(",")
    .map((item) => item.trim().split(";")[0]?.split("-")[0]);
  return requested.find(isLocale) ?? defaultLocale;
}

export function withLocaleParam(input: string, locale: Locale): string {
  const url = new URL(input);
  url.searchParams.set("lang", locale);
  return url.toString();
}
