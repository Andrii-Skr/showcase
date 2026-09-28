import { describe, expect, it } from "vitest";
import { apps } from "@/lib/catalog";
import { locales } from "@/lib/i18n";
describe("catalog", () => {
  it("has unique slugs and origins", () => { expect(new Set(apps.map((app) => app.slug)).size).toBe(apps.length); expect(new Set(apps.map((app) => app.origin)).size).toBe(apps.length); });
  it("contains complete localized copy and media", () => { for (const app of apps) for (const locale of locales) { expect(app.content[locale].imageAlt).toHaveLength(3); expect(app.media[locale].gallery).toHaveLength(3); expect(app.media[locale].poster).toBe(app.media[locale].gallery[0]); } });
  it("uses localized text-bearing posters", () => { for (const app of apps) expect(new Set(locales.map((locale) => app.media[locale].poster)).size).toBe(locales.length); });
  it("lists LoveSpin with an embedded demo", () => { const spin = apps.find((app) => app.slug === "lovespin"); expect(spin?.embedUrl).toContain("spin.justours.love/demo"); expect(spin?.liveUrl).toContain("spin.justours.love"); });
  it("replaces Valentine with Love Mailbox", () => { expect(apps.map((app) => app.slug)).toContain("love-mailbox"); expect(apps.map((app) => app.slug)).not.toContain("valentine"); });
});
