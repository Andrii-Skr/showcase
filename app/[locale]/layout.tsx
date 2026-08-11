import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { isLocale, locales } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const copy = siteCopy[locale];
  return <NextIntlClientProvider locale={locale}><SiteHeader locale={locale} appsLabel={copy.navApps} privacyLabel={copy.navPrivacy} />{children}</NextIntlClientProvider>;
}
