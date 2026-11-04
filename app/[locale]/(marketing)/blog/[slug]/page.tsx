import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui";

// Predložak članka (faza 3): naslov, kategorija, datum, autor, naslovna
// slika, sadržaj, CTA na dnu i povezani članci. Sadržaj piše klijentica
// kroz admin (HTML iz rich-text editora).
export const dynamic = "force-dynamic";

interface BlogPost {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string | null;
  content_html: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  published_at: string | null;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select(
      "id, slug, category, title, excerpt, content_html, cover_image_url, cover_image_alt, author, meta_title, meta_description, og_image_url, cta_label, cta_url, published_at"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("blog post fetch failed:", error);
    return null;
  }
  return data;
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// SEO polja po članku (3.1/3.5)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      type: "article",
      images: post.og_image_url || post.cover_image_url || undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const t = await getTranslations("blogPage");

  // Povezani članci: ista kategorija, pa najnoviji ostali
  const { data: related } = await getSupabase()
    .from("blog_posts")
    .select("slug, title, category, published_at")
    .eq("is_published", true)
    .neq("slug", post.slug)
    .order("published_at", { ascending: false })
    .limit(6);
  const relatedPosts = (related ?? [])
    .sort((a, b) =>
      a.category === post.category && b.category !== post.category ? -1 : 1
    )
    .slice(0, 3);

  const formatDate = (iso: string | null) =>
    iso
      ? new Intl.DateTimeFormat(locale === "hr" ? "hr" : "en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(iso))
      : "";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brendiapro.hr";

  // Article schema (3.5)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: post.og_image_url || post.cover_image_url || undefined,
    datePublished: post.published_at || undefined,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Brendia Pro®" },
    mainEntityOfPage: `${baseUrl}/${locale}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article>
        {/* Zaglavlje članka */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-cream">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors mb-8"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {t("backToBlog")}
              </Link>
              <div className="flex items-center gap-3 text-sm text-primary/50 mb-4">
                <span className="text-secondary font-medium uppercase tracking-wider text-xs">
                  {t(`categories.${post.category}`)}
                </span>
                {post.published_at && <span>{formatDate(post.published_at)}</span>}
                <span>· {post.author}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-primary leading-tight">
                {post.title}
              </h1>
            </div>
          </Container>
        </section>

        {/* Naslovna slika */}
        {post.cover_image_url && (
          <section className="bg-cream pb-12">
            <Container>
              <div className="max-w-4xl mx-auto relative aspect-[16/9]">
                <Image
                  src={post.cover_image_url}
                  alt={post.cover_image_alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Container>
          </section>
        )}

        {/* Sadržaj */}
        <section className="py-16 md:py-24 bg-white">
          <Container>
            <div
              className="max-w-3xl mx-auto prose prose-lg prose-headings:font-heading prose-headings:text-primary prose-p:text-primary/80 prose-li:text-primary/80 prose-strong:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content_html }}
            />

            {/* CTA na dnu članka */}
            {post.cta_label && post.cta_url && (
              <div className="max-w-3xl mx-auto mt-12 bg-cream p-8 text-center">
                <p className="text-primary font-medium mb-4">{post.cta_label}</p>
                <a
                  href={post.cta_url}
                  className="inline-block bg-primary text-white px-8 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  {t("ctaButton")}
                </a>
              </div>
            )}
          </Container>
        </section>

        {/* Povezani članci */}
        {relatedPosts.length > 0 && (
          <section className="py-16 md:py-24 bg-cream">
            <Container>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-heading text-primary mb-8 text-center">
                  {t("relatedPosts")}
                </h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp.slug}
                      href={{ pathname: "/blog/[slug]", params: { slug: rp.slug } }}
                      className="bg-white p-6 hover:shadow-md transition-shadow"
                    >
                      <p className="text-secondary text-xs font-medium uppercase tracking-wider mb-2">
                        {t(`categories.${rp.category}`)}
                      </p>
                      <p className="text-primary font-heading leading-snug">{rp.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}
      </article>
    </>
  );
}
