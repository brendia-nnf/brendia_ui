"use client";

import { useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container, Button } from "@/components/ui";
import { useGSAP } from "@/hooks";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CoursePreview() {
  const t = useTranslations("coursePreview");
  const sectionRef = useRef<HTMLElement>(null);

  const programs = [
    {
      slug: "foundation-certification",
      key: "online",
      featured: false,
    },
    {
      slug: "artist-online-live",
      key: "onlineLive",
      featured: false,
    },
    {
      slug: "artist-group",
      key: "group",
      featured: true,
    },
    {
      slug: "brendia-pro-artist-1v1",
      key: "oneDay",
      featured: false,
    },
    {
      slug: "artist-1v1-two-days",
      key: "twoDays",
      featured: false,
    },
  ];

  useGSAP(
    () => {
      // Animate heading
      gsap.fromTo(
        "[data-heading]",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Animate course cards
      gsap.fromTo(
        "[data-course]",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-courses]",
            start: "top 80%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-cream">
      <Container>
        {/* Section heading */}
        <div data-heading className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-4">
            {t("tagline")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-primary mb-6">
            {t("title")}
          </h2>
          <p className="text-lg text-primary/60 leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Program cards */}
        <div
          data-courses
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {programs.map((program) => (
            <div
              key={program.slug}
              data-course
              className="relative bg-white p-8 flex flex-col"
            >
              {/* Prva grupa badge */}
              {program.key === "group" && (
                <div className="absolute -top-4 left-8 bg-secondary text-white px-4 py-1 text-xs font-medium tracking-wider uppercase">
                  {t("group.firstGroupNote")}
                </div>
              )}

              {/* Program header */}
              <div className="mb-6">
                <p className="text-secondary text-sm font-medium mb-2">
                  {t(`${program.key}.subtitle`)}
                </p>
                <h3 className="text-xl lg:text-2xl font-heading text-primary mb-3">
                  {t(`${program.key}.title`)}
                </h3>
                <p className="text-3xl font-heading text-primary">
                  {t(`${program.key}.price`)}
                </p>
                <p className="text-xs text-primary/40 mt-1">{t("vatNote")}</p>
              </div>

              <p className="text-primary/60 text-sm leading-relaxed mb-4">
                {t(`${program.key}.description`)}
              </p>

              <p className="text-primary/70 text-sm leading-relaxed mb-8">
                <span className="font-medium text-primary">
                  {t("forWhoLabel")}:
                </span>{" "}
                {t(`${program.key}.forWho`)}
              </p>

              {/* CTA */}
              <div className="mt-auto">
                <Link href={`/courses/${program.slug}`} className="block">
                  <Button
                    variant={program.featured ? "primary" : "outline"}
                    className="w-full"
                  >
                    {t("learnMore")}
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          {/* "All programs" tile keeps the 6-grid balanced */}
          <div
            data-course
            className="relative bg-primary text-white p-8 flex flex-col justify-center items-center text-center"
          >
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {t("additionalInfo")}
            </p>
            <Link href="/courses">
              <Button variant="secondary">{t("viewAll")}</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
