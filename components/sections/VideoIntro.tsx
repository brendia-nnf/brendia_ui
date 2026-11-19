"use client";

import { useRef } from "react";
import { Container } from "@/components/ui";
import { useTranslations } from "next-intl";
import { useGSAP } from "@/hooks";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function VideoIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations("videoIntro");

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-animate]",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
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
        <div className="max-w-4xl mx-auto">
          {/* Section heading */}
          <div data-animate className="text-center mb-12">
            <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-4">
              {t("tagline")}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-primary">
              {t("title")}
            </h2>
          </div>

          {/* Video: izbačen na zahtjev klijentice (11/2026), novi se snima —
              do tada prazan okvir s natpisom Coming soon */}
          <div data-animate className="relative aspect-video bg-primary/5 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl md:text-3xl font-heading text-primary/40 tracking-widest uppercase">
                {t("comingSoon")}
              </p>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-secondary/30" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-secondary/30" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-secondary/30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-secondary/30" />
          </div>
        </div>
      </Container>
    </section>
  );
}
