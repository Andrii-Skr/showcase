import { NextResponse } from "next/server";
import { isLocale, safeLocalPath } from "@/lib/i18n";

export function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale");
  const next = url.searchParams.get("next");
  if (!isLocale(locale)) return new NextResponse(null, { status: 307, headers: { Location: "/" } });
  const response = new NextResponse(null, { status: 307, headers: { Location: safeLocalPath(next) } });
  response.cookies.set("justours_locale", locale, {
    maxAge: 31_536_000,
    path: "/",
    sameSite: "lax",
    secure: url.protocol === "https:",
  });
  return response;
}
