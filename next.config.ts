import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Naslovne slike bloga i prije/poslije galerija metode dolaze iz
    // Supabase storagea (upload kroz admin na platformi)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Ensure the email template ships with the /api/subscribe serverless function
  outputFileTracingIncludes: {
    "/api/subscribe": ["./emails/welcome-onboarding.html"],
  },
  // Trajna preusmjeravanja (1.1 + 3.3) sa starih, indeksiranih adresa:
  //  - Advanced programi uklonjeni iz ponude → Tečajevi
  //  - stari slugovi tečajeva → novi SEO slugovi
  //  - /courses → /hr/tecajevi (HR verzija koristi lokalizirane putanje)
  async redirects() {
    const coursesList = { hr: "/hr/tecajevi", en: "/en/courses" };
    // stari slug (live) → novi urlSlug; null = na popis Tečajeva
    const slugMap: Record<string, string | null> = {
      "foundation-certification": "artist-online",
      "brendia-pro-artist-1v1": "artist-1-na-1-jedan-dan",
      "master-certification": null,
      "brendia-pro-master-1v1": null,
    };

    const rules = [];

    for (const [oldSlug, newSlug] of Object.entries(slugMap)) {
      const dest = {
        hr: newSlug ? `/hr/tecajevi/${newSlug}` : coursesList.hr,
        en: newSlug ? `/en/courses/${newSlug}` : coursesList.en,
      };
      rules.push(
        // bez jezičnog prefiksa → HR (zadani jezik)
        { source: `/courses/${oldSlug}`, destination: dest.hr, permanent: true },
        { source: `/hr/courses/${oldSlug}`, destination: dest.hr, permanent: true },
        { source: `/hr/tecajevi/${oldSlug}`, destination: dest.hr, permanent: true },
        { source: `/en/courses/${oldSlug}`, destination: dest.en, permanent: true }
      );
      // Advanced checkout linkovi → Tečajevi
      if (!newSlug) {
        rules.push(
          { source: `/checkout/${oldSlug}`, destination: coursesList.hr, permanent: true },
          { source: `/hr/checkout/${oldSlug}`, destination: coursesList.hr, permanent: true },
          { source: `/en/checkout/${oldSlug}`, destination: coursesList.en, permanent: true }
        );
      }
    }

    // stari popis tečajeva na HR verziji
    rules.push(
      { source: "/courses", destination: coursesList.hr, permanent: true },
      { source: "/hr/courses", destination: coursesList.hr, permanent: true }
    );

    return rules;
  },
};

export default withNextIntl(nextConfig);
