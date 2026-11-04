"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container, Button } from "@/components/ui";

interface Artist {
  id: string;
  full_name: string;
  salon_name: string | null;
  city: string;
  country: string;
  instagram_url: string | null;
  website_url: string | null;
  certified_at: string | null;
}

// Certificirane Brendia Pro® Artistice (2.7): popis s pretragom po gradu
// i salonu. Na popisu su samo polaznice koje su dale suglasnost.
export default function CertifiedArtistsPage() {
  const t = useTranslations("artistsPage");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/certified-artists")
      .then((r) => r.json())
      .then((d) => setArtists(d.artists ?? []))
      .catch(() => setArtists([]))
      .finally(() => setLoaded(true));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return artists;
    return artists.filter((a) =>
      [a.city, a.salon_name, a.full_name, a.country]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q))
    );
  }, [artists, query]);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-4">
              {t("tagline")}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-primary mb-6">
              {t("title")}
            </h1>
            <p className="text-lg text-primary/70 leading-relaxed">
              {t("description")}
            </p>
          </div>
        </Container>
      </section>

      {/* Search + list */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-12">
              <svg
                className="w-5 h-5 text-primary/40 absolute left-4 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full pl-12 pr-4 py-4 border border-primary/15 focus:border-secondary focus:outline-none text-primary placeholder:text-primary/30 bg-cream"
              />
            </div>

            {loaded && artists.length === 0 && (
              <div className="text-center py-16 bg-cream">
                <svg
                  className="w-12 h-12 text-secondary/50 mx-auto mb-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                <p className="text-primary/60 max-w-md mx-auto">
                  {t("emptyState")}
                </p>
              </div>
            )}

            {loaded && artists.length > 0 && filtered.length === 0 && (
              <p className="text-center text-primary/50 py-12">
                {t("noResults")}
              </p>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              {filtered.map((artist) => (
                <div key={artist.id} className="bg-cream p-6 flex flex-col">
                  <h3 className="text-xl font-heading text-primary mb-1">
                    {artist.full_name}
                  </h3>
                  {artist.salon_name && (
                    <p className="text-secondary text-sm font-medium mb-2">
                      {artist.salon_name}
                    </p>
                  )}
                  <p className="text-primary/60 text-sm mb-3">
                    {artist.city}
                    {artist.country && artist.country !== "Hrvatska"
                      ? `, ${artist.country}`
                      : ""}
                  </p>
                  {artist.certified_at && (
                    <p className="text-primary/40 text-xs mb-3">
                      {t("certifiedSince", {
                        year: new Date(artist.certified_at).getFullYear(),
                      })}
                    </p>
                  )}
                  <div className="mt-auto flex gap-4 text-sm">
                    {artist.instagram_url && (
                      <a
                        href={artist.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline"
                      >
                        Instagram
                      </a>
                    )}
                    {artist.website_url && (
                      <a
                        href={artist.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline"
                      >
                        Web
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-primary text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-heading mb-8">
              {t("becomeOne")}
            </h2>
            <Link href="/courses">
              <Button variant="secondary" size="lg">
                {t("becomeOneCta")}
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
