import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Analytics } from "@/components/analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://justours.love"),
  title: { default: "Just Ours Love — apps made for two", template: "%s — Just Ours Love" },
  description: "Small digital worlds for the two of you.",
  openGraph: { title: "Just Ours Love", description: "Small digital worlds for the two of you.", url: "https://justours.love", siteName: "Just Ours Love", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#150d13" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}<Analytics /></body></html>;
}
