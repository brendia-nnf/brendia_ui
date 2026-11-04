import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// Meta naslov i opis po programu (3.1) — ključ je SEO slug programa
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  return pageMetadata(locale, slug);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
