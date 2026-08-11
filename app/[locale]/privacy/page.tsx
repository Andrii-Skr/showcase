import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export const metadata: Metadata = { title: "Privacy" };
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = siteCopy[locale];
  return <main className="privacy-page"><Link className="back-link" href={`/${locale}`}>← Just Ours Love</Link><p className="eyebrow">{copy.navPrivacy}</p><h1>{copy.privacyTitle}</h1>{copy.privacyBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</main>;
}
