import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getPathname } from "@/i18n/routing";

// Meta naslov i opis stranice (3.1)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getPathname({
    locale: locale as "hr" | "en",
    href: "/method",
  });
  return pageMetadata(locale, "method", canonical);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
