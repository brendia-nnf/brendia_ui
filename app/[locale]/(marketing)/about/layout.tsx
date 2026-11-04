import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// Meta naslov i opis stranice (3.1)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "about");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
