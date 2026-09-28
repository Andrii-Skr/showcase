import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppArtwork } from "@/components/app-artwork";
import { AppPreview } from "@/components/app-preview";
import { HeroMotion, Reveal } from "@/components/hero-motion";
import { apps } from "@/lib/catalog";
import { isLocale, locales, withLocaleParam } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = siteCopy[locale];
  const title = copy.heroKicker;
  const image = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: "Just Ours Love — apps made for two" };
  return {
    title,
    description: copy.heroBody,
    alternates: { canonical: `/${locale}`, languages: Object.fromEntries(locales.map((item) => [item, `/${item}`])) },
    openGraph: { title: `${title} — Just Ours Love`, description: copy.heroBody, url: `/${locale}`, siteName: "Just Ours Love", type: "website", images: [image] },
    twitter: { card: "summary_large_image", title: `${title} — Just Ours Love`, description: copy.heroBody, images: [image] },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = siteCopy[locale];
  return <main>
    <section className="hero">
      <div className="hero-backdrop" aria-hidden><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-figures"><span /><span /></div><div className="grain" /></div>
      <HeroMotion><p className="eyebrow">{copy.heroKicker}</p><h1><span>Just Ours Love</span>{copy.heroTitle}</h1><p className="hero-copy">{copy.heroBody}</p><Link className="text-link light" href={`/${locale}#collection`}>{copy.heroCta}<span aria-hidden>↓</span></Link></HeroMotion>
      <p className="hero-index" aria-hidden>01 — {String(apps.length).padStart(2, "0")}</p>
    </section>
    <section className="collection-intro" id="collection"><Reveal><p className="eyebrow">{copy.collectionLabel}</p><h2>{copy.collectionTitle}</h2></Reveal></section>
    <div className="app-stories">
      {apps.map((app) => { const content = app.content[locale]; const media = app.media[locale]; const launchUrl = withLocaleParam(app.liveUrl, locale); return <section className="app-story" key={app.slug} style={{ "--app-accent": app.accent } as React.CSSProperties}>
        <div className="story-copy"><p className="story-number">{app.number}</p><p className="eyebrow">{content.eyebrow}</p><h2>{content.name}</h2><h3>{content.tagline}</h3><p>{content.summary}</p><Link className="text-link" href={`/${locale}/apps/${app.slug}`}>{copy.detailCta}<span aria-hidden>↗</span></Link></div>
        <Reveal className="story-art"><div className="artwork-shell"><AppArtwork app={app} poster={media.poster} alt={content.imageAlt[0]} /><AppPreview app={app.slug} locale={locale} embedUrl={app.embedUrl} origin={app.origin} poster={media.poster} alt={content.imageAlt[0]} launchUrl={launchUrl} surface="home" labels={{ open: content.previewLabel, close: copy.closePreview, loading: copy.loadingPreview, unavailable: content.unavailableLabel, launch: content.launchLabel }} /></div></Reveal>
      </section>; })}
    </div>
    <section className="final-cta"><Reveal><p className="eyebrow">{copy.finalKicker}</p><h2>{copy.finalTitle}</h2><p>{copy.finalBody}</p><Link className="pill-link" href={`/${locale}#collection`}>{copy.finalCta}</Link></Reveal></section>
  </main>;
}
