import { describe, expect, it } from "vitest";
import { localeFromAcceptLanguage, safeLocalPath, withLocaleParam } from "@/lib/i18n";
describe("locale contracts", () => {
  it("selects the first supported browser locale", () => expect(localeFromAcceptLanguage("de-DE,de;q=0.9,uk;q=0.8,en;q=0.7")).toBe("uk"));
  it("prefers the supported locale with the highest quality", () => expect(localeFromAcceptLanguage("ru;q=0.4,en;q=0.8,uk;q=0.6")).toBe("en"));
  it("rejects locales with zero or malformed quality", () => expect(localeFromAcceptLanguage("en;q=0,ru;q=broken,uk;q=0.5")).toBe("uk"));
  it("falls back to English", () => expect(localeFromAcceptLanguage("de-DE")).toBe("en"));
  it("replaces lang and preserves query/hash", () => expect(withLocaleParam("https://paw.justours.love/start?ref=home&lang=ru#voice", "uk")).toBe("https://paw.justours.love/start?ref=home&lang=uk#voice"));
  it("allows same-origin paths for locale redirects", () => expect(safeLocalPath("/ru/apps/unseal?from=home#preview")).toBe("/ru/apps/unseal?from=home#preview"));
  it.each([null, "", "relative", "//evil.example", "/\\evil.example"])("rejects unsafe locale redirect %s", (input) => expect(safeLocalPath(input)).toBe("/"));
});
