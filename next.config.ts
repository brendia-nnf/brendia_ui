import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Ensure the email template ships with the /api/subscribe serverless function
  outputFileTracingIncludes: {
    "/api/subscribe": ["./emails/welcome-onboarding.html"],
  },
  // Advanced programi privremeno uklonjeni iz ponude (dok se ne snime
  // profesionalno) — stare adrese trajno preusmjeravamo na Tečajeve (1.1).
  async redirects() {
    const removedSlugs = ["master-certification", "brendia-pro-master-1v1"];
    return removedSlugs.flatMap((slug) => [
      {
        source: `/courses/${slug}`,
        destination: "/courses",
        permanent: true,
      },
      {
        source: `/:locale(hr|en)/courses/${slug}`,
        destination: "/:locale/courses",
        permanent: true,
      },
      {
        source: `/checkout/${slug}`,
        destination: "/courses",
        permanent: true,
      },
      {
        source: `/:locale(hr|en)/checkout/${slug}`,
        destination: "/:locale/courses",
        permanent: true,
      },
    ]);
  },
};

export default withNextIntl(nextConfig);
