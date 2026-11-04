import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui";

// Blog (faza 3): popis objavljenih članaka s filtrom po kategoriji.
// Članke klijentica piše i objavljuje samostalno kroz admin na platformi.
export const dynamic = "force-dynamic";

const CATEGORIES = ["za-frizerke", "za-klijentice", "iza-kulisa"] as const;

interface BlogPostCard {
  slug: string;
  category: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  published_at: string | null;
}

async function getPosts(category?: string): Promise<BlogPostCard[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let query = supabase
    .from("blog_posts")
    .select("slug, category, title, excerpt, cover_image_url, cover_image_alt, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (category && (CATEGORIES as readonly string[]).includes(category)) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    // Tablica možda još ne postoji (migracija 010) — prazan popis
    console.error("blog_posts fetch failed:", error);
    return [];
  }
  return data ?? [];
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations("blogPage");
  const posts = await getPosts(category);

  const formatDate = (iso: string | null) =>
    iso
      ? new Intl.DateTimeFormat(locale === "hr" ? "hr" : "en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(iso))
      : "";

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-4">
              {t("tagline")}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-primary mb-6">
              {t("title")}
            </h1>
            <p className="text-lg text-primary/70 leading-relaxed">
              {t("description")}
            </p>
          </div>
        </Container>
      </section>

      {/* Filter + popis */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link
              href="/blog"
              className={`px-4 py-2 text-sm border transition-colors ${
                !category
                  ? "bg-primary text-white border-primary"
                  : "border-primary/20 text-primary/70 hover:border-primary"
              }`}
            >
              {t("allCategories")}
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={{ pathname: "/blog", query: { category: c } }}
                className={`px-4 py-2 text-sm border transition-colors ${
                  category === c
                    ? "bg-primary text-white border-primary"
                    : "border-primary/20 text-primary/70 hover:border-primary"
                }`}
              >
                {t(`categories.${c}`)}
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-center text-primary/50 py-16">{t("empty")}</p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post) => (
              <article key={post.slug} className="bg-cream flex flex-col overflow-hidden">
                {post.cover_image_url && (
                  <Link href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}>
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={post.cover_image_url}
                        alt={post.cover_image_alt || post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-primary/50 mb-3">
                    <span className="text-secondary font-medium uppercase tracking-wider">
                      {t(`categories.${post.category}`)}
                    </span>
                    {post.published_at && <span>{formatDate(post.published_at)}</span>}
                  </div>
                  <h2 className="text-xl font-heading text-primary mb-3">
                    <Link href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}>
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-primary/60 text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto">
                    <Link
                      href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                      className="text-secondary text-sm font-medium hover:underline"
                    >
                      {t("readMore")} →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
