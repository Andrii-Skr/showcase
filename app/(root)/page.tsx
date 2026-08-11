import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale, localeFromAcceptLanguage } from "@/lib/i18n";

export default async function RootPage() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const saved = cookieStore.get("justours_locale")?.value;
  const locale = isLocale(saved) ? saved : localeFromAcceptLanguage(headerStore.get("accept-language"));
  redirect(`/${locale}`);
}
