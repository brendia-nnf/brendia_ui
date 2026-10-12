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

const APP_STORE_URL = "https://apps.apple.com/hr/app/brendia-pro/id6815556083";

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

  const appStoreBadgeSrc =
    locale === "hr"
      ? "/images/app/app-store-badge-hr.svg"
      : "/images/app/app-store-badge-en.svg";

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

              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-opacity hover:opacity-80"
              >
                <Image
                  src={appStoreBadgeSrc}
                  alt={t("appStoreAlt")}
                  width={200}
                  height={63}
                  className="h-[63px] w-auto"
                />
              </a>
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
