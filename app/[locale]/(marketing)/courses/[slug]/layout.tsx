import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getPathname } from "@/i18n/routing";

// Meta naslov i opis po programu (3.1) — ključ je SEO slug programa
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const canonical = getPathname({
    locale: locale as "hr" | "en",
    href: { pathname: "/courses/[slug]", params: { slug } },
  });
  return pageMetadata(locale, slug, canonical);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
