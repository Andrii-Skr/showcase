"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { AppSlug } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import { withLocaleParam } from "@/lib/i18n";

declare global { interface Window { umami?: { track: (name: string, data?: Record<string, string>) => void } } }

type PreviewState = "closed" | "loading" | "ready" | "failed";

export function AppPreview({ app, locale, embedUrl, origin, poster, alt, launchUrl, surface, labels }: {
  app: AppSlug;
  locale: Locale;
  embedUrl: string;
  origin: string;
  poster: string;
  alt: string;
  launchUrl: string;
  surface: "home" | "detail";
  labels: { open: string; close: string; loading: string; unavailable: string; launch: string };
}) {
  const reduce = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<PreviewState>("closed");
  const isOpen = state !== "closed";
  const src = useMemo(() => withLocaleParam(embedUrl, locale), [embedUrl, locale]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== origin || event.data?.type !== "justours:demo-ready" || event.data?.version !== 1 || event.data?.app !== app) return;
      setState((current) => {
        if (current !== "loading") return current;
        window.umami?.track("app_preview_ready", { app, locale, surface });
        return "ready";
      });
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [app, locale, origin, surface]);

  useEffect(() => {
    if (state !== "loading") return;
    const timer = window.setTimeout(() => {
      setState("failed");
      window.umami?.track("app_preview_failed", { app, locale, surface });
    }, 10_000);
    return () => window.clearTimeout(timer);
  }, [app, locale, state, surface]);

  const close = useCallback(() => {
    setState("closed");
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, isOpen]);

  const open = () => {
    setState("loading");
    window.umami?.track("app_preview_open", { app, locale, surface });
  };

  const modal = isOpen ? createPortal(
    <AnimatePresence>
      <motion.div
          className="preview-modal-backdrop"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}
        >
          <motion.div
            className="preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${app} demo`}
            initial={reduce ? false : { y: 24, scale: .985 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 18, scale: .99 }}
          >
            <button ref={closeRef} className="preview-modal-close" type="button" onClick={close}>{labels.close}<span aria-hidden>×</span></button>
            {state === "failed" ? (
              <div className="preview-modal-failed">
                <div className="preview-modal-poster" style={{ backgroundImage: `url(${poster})` }} role="img" aria-label={alt} />
                <div className="preview-modal-failure-copy"><p role="status">{labels.unavailable}</p></div>
              </div>
            ) : (
              <>
                <iframe allow="autoplay" sandbox="allow-scripts allow-same-origin" src={src} title={`${app} demo`} />
                {state === "loading" ? <div className="preview-loading" role="status"><span />{labels.loading}</div> : null}
              </>
            )}
            <a
              className="preview-modal-launch"
              href={launchUrl}
              data-umami-event="app_launch"
              data-umami-event-app={app}
              data-umami-event-locale={locale}
              data-umami-event-surface="preview"
            >
              {labels.launch}<span aria-hidden>↗</span>
            </a>
          </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  ) : null;

  return <>
    <button ref={triggerRef} className="poster-preview-trigger" type="button" onClick={open}><span aria-hidden>↗</span>{labels.open}</button>
    {modal}
  </>;
}
