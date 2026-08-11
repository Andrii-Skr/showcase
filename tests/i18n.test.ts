import { describe, expect, it } from "vitest";
import { localeFromAcceptLanguage, withLocaleParam } from "@/lib/i18n";
describe("locale contracts", () => {
  it("selects the first supported browser locale", () => expect(localeFromAcceptLanguage("de-DE,de;q=0.9,uk;q=0.8,en;q=0.7")).toBe("uk"));
  it("falls back to English", () => expect(localeFromAcceptLanguage("de-DE")).toBe("en"));
  it("replaces lang and preserves query/hash", () => expect(withLocaleParam("https://paw.justours.love/start?ref=home&lang=ru#voice", "uk")).toBe("https://paw.justours.love/start?ref=home&lang=uk#voice"));
});
