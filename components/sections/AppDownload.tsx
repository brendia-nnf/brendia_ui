"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui";
import { useGSAP } from "@/hooks";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.brendiapro.app";

export function AppDownload() {
  const t = useTranslations("appDownload");
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        phoneRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        "[data-content] > *",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const badgeSrc =
    locale === "hr"
      ? "/images/app/google-play-badge-hr.png"
      : "/images/app/google-play-badge-en.png";

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-cream overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div data-content>
            <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-4">
              {t("tagline")}
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-primary leading-[1.1] mb-6">
              {t("title")}
            </h2>

            <p className="text-lg text-primary/70 leading-relaxed max-w-lg mb-8">
              {t("description")}
            </p>

            <ul className="space-y-3 mb-10">
              {["feature1", "feature2", "feature3"].map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-3 text-primary/80"
                >
                  <svg
                    className="w-5 h-5 text-secondary shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {t(key)}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-opacity hover:opacity-80"
              >
                <Image
                  src={badgeSrc}
                  alt={t("googlePlayAlt")}
                  width={162}
                  height={63}
                  className="h-[63px] w-auto"
                />
              </a>

              {/* App Store coming soon */}
              <div className="inline-flex items-center gap-3 h-[63px] px-5 rounded-lg border border-primary/20 text-primary/50 select-none w-fit">
                <svg
                  className="w-6 h-6 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="leading-tight">
                  <p className="text-[11px] uppercase tracking-wide">
                    {t("appStoreSoonLabel")}
                  </p>
                  <p className="text-sm font-medium">{t("appStoreSoonName")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div ref={phoneRef} className="relative">
              <div className="relative w-[260px] sm:w-[300px] rounded-[2.5rem] bg-primary p-2.5 shadow-2xl shadow-primary/20">
                <div className="relative aspect-[660/1434] overflow-hidden rounded-[2rem]">
                  <Image
                    src="/images/app/app-dashboard.png"
                    alt={t("screenshotAlt")}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-secondary/30 rounded-[2.5rem] -z-10" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
