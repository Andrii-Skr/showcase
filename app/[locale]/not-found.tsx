import Link from "next/link";
import { getLocale } from "next-intl/server";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export default async function NotFound() {
  const requestedLocale = await getLocale();
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const copy = siteCopy[locale];
  return <main className="not-found"><p className="eyebrow">404</p><h1>{copy.notFoundTitle}</h1><Link className="pill-link" href={`/${locale}`}>{copy.notFoundBack}</Link></main>;
}
