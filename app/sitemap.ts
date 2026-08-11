import type { MetadataRoute } from "next";
import { appSlugs } from "@/lib/catalog";
import { locales } from "@/lib/i18n";
export default function sitemap(): MetadataRoute.Sitemap { const now = new Date(); return locales.flatMap((locale) => [{ url: `https://justours.love/${locale}`, lastModified: now, priority: 1 }, { url: `https://justours.love/${locale}/privacy`, lastModified: now, priority: 0.3 }, ...appSlugs.map((slug) => ({ url: `https://justours.love/${locale}/apps/${slug}`, lastModified: now, priority: 0.8 }))]); }
