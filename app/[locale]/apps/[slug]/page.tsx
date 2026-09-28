import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppArtwork } from "@/components/app-artwork";
import { AppPreview } from "@/components/app-preview";
import { Reveal } from "@/components/hero-motion";
import { appSlugs, getApp } from "@/lib/catalog";
import { isLocale, locales, withLocaleParam } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export function generateStaticParams() { return locales.flatMap((locale) => appSlugs.map((slug) => ({ locale, slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const app = getApp(slug);
  if (!app) return {};
  const content = app.content[locale];
  const url = `/${locale}/apps/${slug}`;
  const image = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: "Just Ours Love — apps made for two" };
  return {
    title: content.name,
    description: content.summary,
    alternates: { canonical: url, languages: Object.fromEntries(locales.map((item) => [item, `/${item}/apps/${slug}`])) },
    openGraph: { title: content.name, description: content.summary, url, siteName: "Just Ours Love", type: "website", images: [image] },
    twitter: { card: "summary_large_image", title: content.name, description: content.summary, images: [image] },
  };
}

export default async function AppPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const app = getApp(slug);
  if (!app) notFound();
  const content = app.content[locale];
  const media = app.media[locale];
  const copy = siteCopy[locale];
  const launchUrl = withLocaleParam(app.liveUrl, locale);
  return <main className="detail-page" style={{ "--app-accent": app.accent } as React.CSSProperties}>
    <section className="detail-hero"><div className="detail-copy"><Link className="back-link" href={`/${locale}#collection`}>← {copy.back}</Link><p className="eyebrow">{content.eyebrow}</p><h1>{content.name}</h1><h2>{content.tagline}</h2><p>{content.description}</p><a className="pill-link app-launch" href={launchUrl} data-umami-event="app_launch" data-umami-event-app={app.slug} data-umami-event-locale={locale} data-umami-event-surface="hero">{content.launchLabel}<span aria-hidden>↗</span></a></div><Reveal className="detail-art"><div className="artwork-shell"><AppArtwork app={app} poster={media.poster} alt={content.imageAlt[0]} priority /><AppPreview app={app.slug} locale={locale} embedUrl={app.embedUrl} origin={app.origin} poster={media.poster} alt={content.imageAlt[0]} launchUrl={launchUrl} surface="detail" labels={{ open: content.previewLabel, close: copy.closePreview, loading: copy.loadingPreview, unavailable: content.unavailableLabel, launch: content.launchLabel }} /></div></Reveal></section>
    <section className="gallery-section"><p className="eyebrow">{copy.galleryTitle}</p><div className="gallery-strip">{media.gallery.map((image, index) => <Reveal className="gallery-item" key={image}><Image className="gallery-poster" src={image} alt={content.imageAlt[index]} fill sizes="(max-width: 720px) 86vw, 32vw" /></Reveal>)}</div></section>
    <section className="detail-final"><p className="eyebrow">Just Ours Love × {content.name}</p><h2>{content.tagline}</h2><a className="pill-link app-launch" href={launchUrl} data-umami-event="app_launch" data-umami-event-app={app.slug} data-umami-event-locale={locale} data-umami-event-surface="footer">{copy.detailCta}<span aria-hidden>↗</span></a></section>
  </main>;
}
