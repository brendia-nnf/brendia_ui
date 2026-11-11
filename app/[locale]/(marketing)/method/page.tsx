"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container, Button } from "@/components/ui";

// Kratki video ugradnje — klijentica ga dostavlja naknadno. Dok ne stigne,
// video blok je sakriven; nakon isporuke postaviti putanju (npr.
// "/videos/metoda-ugradnja.mp4") i blok se automatski prikazuje.
const METHOD_VIDEO_SRC: string | null = null;

interface GalleryItem {
  id: string;
  image_before_url: string | null;
  image_after_url: string | null;
  caption: string | null;
}

const COMPARISON_METHODS = ["bp", "keratin", "tape", "rings"] as const;
const COMPARISON_ROWS = [
  "attachment",
  "heatGlue",
  "weight",
  "removal",
  "maintenance",
] as const;

// Stranica Brendia Pro® metoda (faza 3): 7 blokova prema uputama
export default function MethodPage() {
  const t = useTranslations("methodPage");
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    fetch("/api/method-gallery")
      .then((r) => r.json())
      .then((d) => setGallery(d.items ?? []))
      .catch(() => setGallery([]))
      .finally(() => setGalleryLoaded(true));
  }, []);

  return (
    <>
      {/* 1. Hero — isti stil kao hero na Početnoj */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-4">
                {t("hero.tagline")}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-primary leading-[1.1] mb-6">
                {t("hero.title")}
              </h1>
              <p className="text-lg text-primary/70 leading-relaxed max-w-lg">
                {t("hero.subtitle")}
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/method-hero.jpg"
                alt={t("hero.title")}
                fill
                className="object-cover object-[center_35%]"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Što je Brendia Pro® metoda */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[3/4] max-w-md overflow-hidden">
              <Image
                src="/images/nikolina-portrait-color.jpg"
                alt="Nikolina Kljaić"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading text-primary mb-6">
                {t("what.title")}
              </h2>
              <p className="text-primary/70 leading-relaxed mb-4">{t("what.p1")}</p>
              <p className="text-primary/70 leading-relaxed">{t("what.p2")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Po čemu se razlikuje — tablica (desktop) / kartice (mobitel) */}
      <section className="py-20 md:py-32 bg-cream">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading text-primary">
              {t("comparison.title")}
            </h2>
          </div>

          {/* Desktop: tablica */}
          <div className="hidden md:block max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full bg-white text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="text-left p-4"></th>
                  {COMPARISON_METHODS.map((m) => (
                    <th
                      key={m}
                      className={`text-center p-4 font-heading ${
                        m === "bp" ? "text-secondary bg-secondary/5" : "text-primary"
                      }`}
                    >
                      {t(`comparison.methods.${m}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row} className="border-b border-primary/5">
                    <td className="p-4 text-primary font-medium">
                      {t(`comparison.rows.${row}.feature`)}
                    </td>
                    {COMPARISON_METHODS.map((m) => (
                      <td
                        key={m}
                        className={`p-4 text-center text-primary/70 ${
                          m === "bp" ? "bg-secondary/5 text-primary" : ""
                        }`}
                      >
                        {t(`comparison.rows.${row}.${m}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobitel: kartice po metodi */}
          <div className="md:hidden space-y-6">
            {COMPARISON_METHODS.map((m) => (
              <div
                key={m}
                className={`bg-white p-6 ${m === "bp" ? "ring-2 ring-secondary" : ""}`}
              >
                <h3
                  className={`text-lg font-heading mb-4 ${
                    m === "bp" ? "text-secondary" : "text-primary"
                  }`}
                >
                  {t(`comparison.methods.${m}`)}
                </h3>
                <dl className="space-y-3 text-sm">
                  {COMPARISON_ROWS.map((row) => (
                    <div key={row}>
                      <dt className="text-primary/50">{t(`comparison.rows.${row}.feature`)}</dt>
                      <dd className="text-primary/80">{t(`comparison.rows.${row}.${m}`)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <p className="text-center text-primary/50 text-sm mt-8">
            {t("comparison.note")}
          </p>
        </Container>
      </section>

      {/* 4. Prednosti — dva stupca s ikonama */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading text-primary">
              {t("benefits.title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {(["client", "stylist"] as const).map((col) => (
              <div key={col} className="bg-cream p-8 md:p-10">
                <h3 className="text-xl font-heading text-primary mb-6">
                  {t(`benefits.${col}.title`)}
                </h3>
                <ul className="space-y-4">
                  {(t.raw(`benefits.${col}.items`) as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-8 h-8 flex-shrink-0 bg-secondary/10 text-secondary flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-primary/70 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Radovi iz Studio One by Nina — prije/poslije galerija */}
      <section className="py-20 md:py-32 bg-cream">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading text-primary mb-4">
              {t("gallery.title")}
            </h2>
            <p className="text-primary/60">{t("gallery.subtitle")}</p>
          </div>

          {galleryLoaded && gallery.length === 0 && (
            <p className="text-center text-primary/50 py-8">{t("gallery.empty")}</p>
          )}

          <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {gallery.map((item) => (
              <figure key={item.id} className="bg-white p-4">
                <div className="grid grid-cols-2 gap-2">
                  {item.image_before_url && (
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={item.image_before_url}
                        alt={`${t("gallery.before")} — ${item.caption || ""}`}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-primary/80 text-white text-xs px-2 py-0.5">
                        {t("gallery.before")}
                      </span>
                    </div>
                  )}
                  {item.image_after_url && (
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={item.image_after_url}
                        alt={`${t("gallery.after")} — ${item.caption || ""}`}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-secondary text-white text-xs px-2 py-0.5">
                        {t("gallery.after")}
                      </span>
                    </div>
                  )}
                </div>
                {item.caption && (
                  <figcaption className="text-sm text-primary/60 mt-3 text-center">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Video — isti player kao na Početnoj; skriven dok video ne stigne */}
      {METHOD_VIDEO_SRC && (
        <section className="py-20 md:py-32 bg-white">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-heading text-primary mb-4">
                  {t("video.title")}
                </h2>
                <p className="text-primary/60">{t("video.description")}</p>
              </div>
              <div className="relative aspect-video bg-primary/5 overflow-hidden group">
                <video
                  className="w-full h-full object-cover"
                  playsInline
                  controls={isVideoPlaying}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  <source src={METHOD_VIDEO_SRC} type="video/mp4" />
                </video>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 7. Poziv na akciju */}
      <section className="py-20 md:py-32 bg-primary text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-heading mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-white/70 mb-8">{t("cta.description")}</p>
            <Link href="/courses">
              <Button variant="secondary" size="lg">
                {t("cta.button")}
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
