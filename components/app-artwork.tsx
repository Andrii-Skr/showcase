import Image from "next/image";
import type { AppDefinition } from "@/lib/catalog";

export function AppArtwork({ app, poster, alt, priority = false, className = "" }: { app: AppDefinition; poster: string; alt: string; priority?: boolean; className?: string }) {
  return (
    <div className={`artwork ${className}`} style={{ "--app-accent": app.accent } as React.CSSProperties}>
      <div className="artwork-glow" />
      <Image className="artwork-poster" src={poster} alt={alt} fill priority={priority} sizes="(max-width: 800px) 94vw, 52vw" />
    </div>
  );
}
