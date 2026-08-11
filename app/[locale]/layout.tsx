import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import { Analytics } from "@/components/analytics";
import { SiteHeader } from "@/components/site-header";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#150d13" };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const copy = siteCopy[locale];
  return {
    metadataBase: new URL("https://justours.love"),
    title: { default: `Just Ours Love — ${copy.heroKicker}`, template: "%s — Just Ours Love" },
    description: copy.heroBody,
    openGraph: { title: "Just Ours Love", description: copy.heroBody, url: `/${locale}`, siteName: "Just Ours Love", type: "website" },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  setRequestLocale(locale);
  const copy = siteCopy[locale];
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider locale={locale}>
          <SiteHeader locale={locale} appsLabel={copy.navApps} privacyLabel={copy.navPrivacy} />
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
