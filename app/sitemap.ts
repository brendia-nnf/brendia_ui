import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brendiapro.hr";

// Lokalizirane putanje (3.2/3.3): HR koristi /tecajevi i /metoda,
// EN /courses i /method. Slugovi programa isti su u oba jezika.
const COURSE_SLUGS = [
  "artist-online",
  "artist-online-uzivo",
  "artist-grupna-edukacija",
  "artist-1-na-1-jedan-dan",
  "artist-1-na-1-dva-dana",
];

type Entry = MetadataRoute.Sitemap[number];

function entry(
  path: { hr: string; en: string },
  priority: number,
  changeFrequency: Entry["changeFrequency"]
): Entry[] {
  return (["hr", "en"] as const).map((locale) => ({
    url: `${baseUrl}/${locale}${path[locale]}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        hr: `${baseUrl}/hr${path.hr}`,
        en: `${baseUrl}/en${path.en}`,
      },
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    ...entry({ hr: "", en: "" }, 1, "weekly"),
    ...entry({ hr: "/metoda", en: "/method" }, 0.9, "monthly"),
    ...entry({ hr: "/tecajevi", en: "/courses" }, 0.9, "weekly"),
    ...COURSE_SLUGS.flatMap((slug) =>
      entry({ hr: `/tecajevi/${slug}`, en: `/courses/${slug}` }, 0.9, "monthly")
    ),
    ...entry({ hr: "/about", en: "/about" }, 0.8, "monthly"),
    ...entry({ hr: "/certified-artists", en: "/certified-artists" }, 0.6, "weekly"),
    ...entry({ hr: "/faq", en: "/faq" }, 0.7, "monthly"),
    ...entry({ hr: "/blog", en: "/blog" }, 0.7, "weekly"),
    ...entry({ hr: "/contact", en: "/contact" }, 0.6, "yearly"),
    ...entry({ hr: "/legal/privacy", en: "/legal/privacy" }, 0.3, "yearly"),
    ...entry({ hr: "/legal/terms", en: "/legal/terms" }, 0.3, "yearly"),
  ];

  // Objavljeni članci bloga (3.6) — ako tablica još ne postoji, preskačemo
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("is_published", true);

    for (const post of posts ?? []) {
      routes.push(
        ...entry({ hr: `/blog/${post.slug}`, en: `/blog/${post.slug}` }, 0.6, "monthly")
      );
    }
  } catch (error) {
    console.error("sitemap blog_posts fetch failed:", error);
  }

  return routes;
}
