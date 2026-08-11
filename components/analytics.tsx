import Script from "next/script";

export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return null;
  return (
    <Script
      defer
      src="https://analytics.justours.love/script.js"
      data-website-id={websiteId}
      data-domains="justours.love"
      data-do-not-track="true"
      data-exclude-search="true"
      data-exclude-hash="true"
      strategy="lazyOnload"
    />
  );
}
