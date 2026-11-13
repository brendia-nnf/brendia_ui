"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui";
import type { GroupSession } from "@/components/sections/GroupScheduleCard";

// Pop-up s terminom grupne edukacije (zahtjev klijentice 4.11.2026.):
// prikazuje se SAMO kad je uključen u adminu na platformi (Termini
// edukacija → "Prikaži pop-up na webu") i dok je upis stvarno moguć.
// Nakon zatvaranja ne iskače ponovno u istoj sesiji preglednika.

const DISMISS_KEY = "bp-group-popup-dismissed";

export function GroupPromoPopup() {
  const t = useTranslations("groupPopup");
  const locale = useLocale();
  const [session, setSession] = useState<GroupSession | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // sessionStorage nedostupan (privatni mod) — pop-up svejedno radi
    }

    let cancelled = false;
    fetch("/api/group-session")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const s = d.session as (GroupSession & { showPopup?: boolean }) | null;
        if (s?.showPopup) {
          setSession(s);
          // Kratka odgoda da ne iskoči prije nego se stranica uopće vidi
          setTimeout(() => !cancelled && setVisible(true), 1500);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible || !session) return null;

  const deadline = new Intl.DateTimeFormat(locale === "hr" ? "hr" : "en-GB", {
    day: "numeric",
    month: "long",
  }).format(new Date(session.enrollmentDeadline + "T12:00:00"));

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Dialog */}
      <div className="relative bg-white max-w-md w-full p-8 shadow-2xl">
        <button
          onClick={dismiss}
          aria-label={t("close")}
          className="absolute top-4 right-4 p-2 text-primary/40 hover:text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="text-secondary text-xs font-medium tracking-widest uppercase mb-3">
          {t("tagline")}
        </p>
        <h2 className="text-2xl font-heading text-primary mb-4">{t("title")}</h2>

        <p className="text-primary font-medium text-base mb-4">
          {t("dates", {
            dates: locale === "hr" ? session.datesLabelHr : session.datesLabelEn,
          })}
        </p>

        <p className="text-sm text-primary/80 leading-relaxed mb-4">
          {t("note", { seats: session.totalSeats })}
        </p>

        <p className="text-sm text-primary font-medium mb-6">
          {t("deadline", { date: deadline })}
        </p>

        <Link
          href={{ pathname: "/courses/[slug]", params: { slug: "artist-grupna-edukacija" } }}
          onClick={dismiss}
          className="block"
        >
          <Button size="lg" className="w-full">
            {t("cta")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
