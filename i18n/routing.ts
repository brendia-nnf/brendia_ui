import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  // Lokalizirane putanje (3.2/3.3): hrvatska verzija koristi /tecajevi i
  // /metoda, engleska /courses i /method. Slugovi programa su isti u oba
  // jezika (lib/constants/courses.ts → urlSlug).
  pathnames: {
    "/": "/",
    "/courses": { hr: "/tecajevi", en: "/courses" },
    "/courses/[slug]": { hr: "/tecajevi/[slug]", en: "/courses/[slug]" },
    "/method": { hr: "/metoda", en: "/method" },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/about": "/about",
    "/faq": "/faq",
    "/contact": "/contact",
    "/certified-artists": "/certified-artists",
    "/checkout/[slug]": "/checkout/[slug]",
    "/checkout/success": "/checkout/success",
    "/checkout/cancel": "/checkout/cancel",
    "/legal/privacy": "/legal/privacy",
    "/legal/terms": "/legal/terms",
    "/legal/payment-security": "/legal/payment-security",
    "/legal/complaints": "/legal/complaints",
    "/legal/cookies": "/legal/cookies",
  },
});

export type AppPathname = keyof typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
