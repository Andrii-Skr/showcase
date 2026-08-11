import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n";

export function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale");
  const next = url.searchParams.get("next");
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/";
  if (!isLocale(locale)) return NextResponse.redirect(new URL("/", url));
  const response = NextResponse.redirect(new URL(safeNext, url));
  response.cookies.set("justours_locale", locale, {
    maxAge: 31_536_000,
    path: "/",
    sameSite: "lax",
    secure: url.protocol === "https:",
  });
  return response;
}
