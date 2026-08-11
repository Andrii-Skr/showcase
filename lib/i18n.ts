export const locales = ["uk", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function localeFromAcceptLanguage(value: string | null): Locale {
  if (!value) return defaultLocale;
  const requested = value.split(",").flatMap((item, index) => {
    const [tag = "", ...parameters] = item.trim().toLowerCase().split(";");
    const qualityParameter = parameters.map((parameter) => parameter.trim()).find((parameter) => parameter.startsWith("q="));
    const quality = qualityParameter ? Number(qualityParameter.slice(2)) : 1;
    const language = tag.split("-")[0];
    const locale = language === "*" ? defaultLocale : isLocale(language) ? language : null;
    return locale && Number.isFinite(quality) && quality > 0 && quality <= 1 ? [{ locale, quality, index }] : [];
  });
  requested.sort((left, right) => right.quality - left.quality || left.index - right.index);
  return requested[0]?.locale ?? defaultLocale;
}

export function withLocaleParam(input: string, locale: Locale): string {
  const url = new URL(input);
  url.searchParams.set("lang", locale);
  return url.toString();
}

export function safeLocalPath(input: string | null): string {
  if (!input?.startsWith("/")) return "/";

  const base = new URL("https://justours.local");
  try {
    const candidate = new URL(input, base);
    if (candidate.origin !== base.origin) return "/";
    return `${candidate.pathname}${candidate.search}${candidate.hash}`;
  } catch {
    return "/";
  }
}
