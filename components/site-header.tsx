"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

function localizedPath(pathname: string, locale: Locale) {
  const parts = pathname.split("/");
  if (parts[1] && locales.includes(parts[1] as Locale)) parts[1] = locale;
  else parts.splice(1, 0, locale);
  return parts.join("/") || `/${locale}`;
}

export function SiteHeader({ locale, appsLabel, privacyLabel }: { locale: Locale; appsLabel: string; privacyLabel: string }) {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <Link className="wordmark" href={`/${locale}`} aria-label="Just Ours Love home">Just Ours Love</Link>
      <nav className="main-nav" aria-label="Primary navigation">
        <Link href={`/${locale}#collection`}>{appsLabel}</Link>
        <Link href={`/${locale}/privacy`}>{privacyLabel}</Link>
      </nav>
      <div className="locale-switcher" aria-label="Language">
        {locales.map((item) => (
          <a
            aria-current={item === locale ? "page" : undefined}
            data-umami-event="locale_change"
            data-umami-event-locale={item}
            href={`/api/locale?locale=${item}&next=${encodeURIComponent(localizedPath(pathname, item))}`}
            key={item}
          >
            {item.toUpperCase()}
          </a>
        ))}
      </div>
    </header>
  );
}
