"use client";

import { useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container, Button } from "@/components/ui";
import {
  PaymentMethodsBlock,
  RefundPolicyBlock,
  MasterclassBlock,
} from "@/components/sections";
import { useGSAP } from "@/hooks";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Nova ponuda (faza 1 redizajna): pet programa, cijene s PDV-om
// Slugovi su SEO URL-ovi (urlSlug iz lib/constants/courses.ts)
const PROGRAMS = [
  { slug: "artist-online", key: "online", image: "/images/courses/foundation.jpg" },
  { slug: "artist-online-uzivo", key: "onlineLive", image: "/images/courses/foundation.jpg" },
  { slug: "artist-grupna-edukacija", key: "group", image: "/images/courses/master.jpg" },
  { slug: "artist-1-na-1-jedan-dan", key: "oneDay", image: "/images/courses/foundation.jpg" },
  { slug: "artist-1-na-1-dva-dana", key: "twoDays", image: "/images/courses/master.jpg" },
] as const;

const COMPARISON_ROWS = [
  "price",
  "videoLessons",
  "liveWork",
  "mentorship",
  "educationKit",
  "masterclass",
  "dates",
] as const;

export default function CoursesPage() {
  const t = useTranslations("coursesPage");
  const heroRef = useRef<HTMLElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const skills = [
    {
      key: "installation",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
    },
    {
      key: "colorMatching",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
        </svg>
      ),
    },
    {
      key: "consultation",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
    },
    {
      key: "maintenance",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
    },
    {
      key: "business",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
    },
    {
      key: "certification",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
  ];

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-animate]",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
          },
        }
      );
    },
    { scope: heroRef }
  );

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <p data-animate className="text-secondary text-sm font-medium tracking-widest uppercase mb-4">
              {t("hero.tagline")}
            </p>
            <h1 data-animate className="text-4xl sm:text-5xl lg:text-6xl font-heading text-primary mb-6">
              {t("hero.title")}
            </h1>
            <p data-animate className="text-lg text-primary/70 leading-relaxed mb-8">
              {t("hero.description")}
            </p>
            <div data-animate className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-primary/50">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t("hero.selfPaced")}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t("hero.lifetimeAccess")}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t("hero.officialCertification")}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Video Introduction */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading text-primary mb-4">
                {t("video.title")}
              </h2>
              <p className="text-primary/60">
                {t("video.description")}
              </p>
            </div>

            <div className="relative aspect-video bg-primary/5 overflow-hidden group">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="/images/video-poster.jpg"
                playsInline
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onEnded={() => setIsVideoPlaying(false)}
              >
                <source src="/videos/video-web-brendia.mp4" type="video/mp4" />
              </video>

              <button
                onClick={handleVideoPlay}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  isVideoPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                }`}
                aria-label={isVideoPlaying ? t("video.pause") : t("video.play")}
              >
                <div className="w-20 h-20 bg-white/95 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {isVideoPlaying ? (
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* What You'll Master */}
      <section className="py-20 md:py-32 bg-cream">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading text-primary mb-4">
              {t("skills.title")}
            </h2>
            <p className="text-primary/60 max-w-2xl mx-auto">
              {t("skills.description")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill) => (
              <div key={skill.key} className="bg-white p-8 group hover:shadow-lg transition-shadow duration-300">
                <div className="w-14 h-14 flex items-center justify-center bg-secondary/10 text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                  {skill.icon}
                </div>
                <h3 className="text-xl font-heading text-primary mb-2">
                  {t(`skills.items.${skill.key}.title`)}
                </h3>
                <p className="text-primary/60">
                  {t(`skills.items.${skill.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Program Cards */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading text-primary mb-4">
              {t("courses.title")}
            </h2>
            <p className="text-primary/60">
              {t("courses.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PROGRAMS.map((program) => (
              <div key={program.slug} className="relative bg-cream overflow-hidden flex flex-col">
                {/* Program Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={t(`courses.${program.key}.title`)}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                  {program.key === "group" && (
                    <div className="absolute top-0 left-0 bg-secondary text-white px-3 py-1 text-xs font-medium tracking-wider uppercase z-10">
                      {t("courses.group.firstGroupNote")}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-6 right-6">
                    <p className="text-white/80 text-sm">{t(`courses.${program.key}.subtitle`)}</p>
                    <h3 className="text-xl font-heading text-white">{t(`courses.${program.key}.title`)}</h3>
                  </div>
                </div>

                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  <div className="mb-4">
                    <p className="text-3xl font-heading text-primary">{t(`courses.${program.key}.price`)}</p>
                    <p className="text-xs text-primary/40 mt-1">{t("courses.vatNote")}</p>
                    <p className="text-sm text-primary/50 mt-2">{t(`courses.${program.key}.duration`)}</p>
                  </div>

                  <p className="text-primary/70 text-sm leading-relaxed mb-4">
                    {t(`courses.${program.key}.description`)}
                  </p>

                  <p className="text-primary/70 text-sm leading-relaxed mb-6">
                    <span className="font-medium text-primary">{t("courses.forWhoLabel")}:</span>{" "}
                    {t(`courses.${program.key}.forWho`)}
                  </p>

                  <div className="mt-auto">
                    <Link href={{ pathname: "/courses/[slug]", params: { slug: program.slug } }} className="block">
                      <Button variant="outline" className="w-full">
                        {t("courses.viewProgram")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-primary/60 text-sm mt-10 max-w-3xl mx-auto">
            {t("courses.kicker")}
          </p>
        </Container>
      </section>

      {/* Comparison Table */}
      <section className="py-20 md:py-32 bg-cream">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading text-primary mb-4">
              {t("comparison.title")}
            </h2>
            <p className="text-primary/60">
              {t("comparison.description")}
            </p>
          </div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full min-w-[860px] bg-white text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="sticky left-0 bg-white text-left p-4 font-heading text-primary z-10 min-w-[160px]"></th>
                  {PROGRAMS.map((p) => (
                    <th key={p.key} className="text-center p-4 font-heading text-primary">
                      {t(`comparison.columns.${p.key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row} className="border-b border-primary/5">
                    <td className="sticky left-0 bg-white p-4 text-primary font-medium z-10">
                      {t(`comparison.rows.${row}.feature`)}
                    </td>
                    {PROGRAMS.map((p) => (
                      <td key={p.key} className="p-4 text-center text-primary/70">
                        {t(`comparison.rows.${row}.${p.key}`)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="sticky left-0 bg-white p-4 z-10"></td>
                  {PROGRAMS.map((p) => (
                    <td key={p.key} className="p-4 text-center">
                      <Link href={{ pathname: "/courses/[slug]", params: { slug: p.slug } }}>
                        <Button variant="outline" size="sm">{t("comparison.select")}</Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-primary/50 text-sm mt-8 max-w-4xl mx-auto">
            {t("comparison.belowNote")}
          </p>
        </Container>
      </section>

      {/* Masterclass + Payment methods + Refund policy */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto space-y-10">
            <MasterclassBlock ns="coursesPage" />
            <PaymentMethodsBlock ns="coursesPage" />
            <RefundPolicyBlock ns="coursesPage" />
          </div>
        </Container>
      </section>

      {/* Meet Your Instructor */}
      <section className="py-20 md:py-32 bg-cream">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/instructor.jpg"
                alt={t("instructor.imageAlt")}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-4">
                {t("instructor.tagline")}
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading text-primary mb-6">
                {t("instructor.title")}
              </h2>
              <p className="text-primary/70 leading-relaxed mb-6">
                {t("instructor.description")}
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="text-xl font-heading text-secondary">{t("instructor.credExperienceTitle")}</p>
                  <p className="text-sm text-primary/50">{t("instructor.credExperienceLabel")}</p>
                </div>
                <div>
                  <p className="text-xl font-heading text-secondary">{t("instructor.credFeedbackTitle")}</p>
                  <p className="text-sm text-primary/50">{t("instructor.credFeedbackLabel")}</p>
                </div>
                <div>
                  <p className="text-xl font-heading text-secondary">{t("instructor.credCertificationTitle")}</p>
                  <p className="text-sm text-primary/50">{t("instructor.credCertificationLabel")}</p>
                </div>
              </div>
              <Link href="/about">
                <Button variant="outline">{t("instructor.learnMore")}</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading text-primary mb-6">
              {t("faqPreview.title")}
            </h2>
            <p className="text-primary/70 mb-8">
              {t("faqPreview.description")}
            </p>
            <Link href="/faq">
              <Button variant="outline">{t("faqPreview.cta")}</Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
