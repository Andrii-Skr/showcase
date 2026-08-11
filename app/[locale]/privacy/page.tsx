import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = siteCopy[locale];
  const url = `/${locale}/privacy`;
  const image = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: "Just Ours Love — apps made for two" };
  return {
    title: copy.navPrivacy,
    description: copy.privacyBody[0],
    alternates: { canonical: url, languages: Object.fromEntries(locales.map((item) => [item, `/${item}/privacy`])) },
    openGraph: { title: copy.privacyTitle, description: copy.privacyBody[0], url, siteName: "Just Ours Love", type: "website", images: [image] },
    twitter: { card: "summary_large_image", title: copy.privacyTitle, description: copy.privacyBody[0], images: [image] },
  };
}
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = siteCopy[locale];
  return <main className="privacy-page"><Link className="back-link" href={`/${locale}`}>← Just Ours Love</Link><p className="eyebrow">{copy.navPrivacy}</p><h1>{copy.privacyTitle}</h1>{copy.privacyBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</main>;
}
