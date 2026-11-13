"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export interface GroupSession {
  id: string;
  datesLabelHr: string;
  datesLabelEn: string;
  enrollmentDeadline: string;
  totalSeats: number;
  seatsLeft: number;
  open: boolean;
}

export function useGroupSession() {
  const [session, setSession] = useState<GroupSession | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/group-session")
      .then((r) => r.json())
      .then((d) => setSession(d.session ?? null))
      .catch(() => setSession(null))
      .finally(() => setLoaded(true));
  }, []);

  return { session, loaded };
}

// Termin i upis grupne edukacije (1.6): termin, rok upisa i broj slobodnih
// mjesta dolaze iz group_education_sessions — klijentica ih ažurira sama.
export function GroupScheduleCard({
  session,
  loaded,
}: {
  session: GroupSession | null;
  loaded: boolean;
}) {
  const t = useTranslations("courseDetail.groupSchedule");
  const locale = useLocale();

  if (!loaded) return null;

  const deadline = session
    ? new Intl.DateTimeFormat(locale === "hr" ? "hr" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(session.enrollmentDeadline + "T12:00:00"))
    : "";

  return (
    <div className="bg-white border border-secondary/30 p-6 md:p-8">
      <h3 className="text-xl font-heading text-primary mb-4">{t("title")}</h3>

      {!session ? (
        <p className="text-primary/60 text-sm">{t("closed")}</p>
      ) : (
        <div className="space-y-3 text-sm text-primary/70 leading-relaxed">
          <p className="text-primary font-medium text-base">
            {t("firstGroup", {
              dates: locale === "hr" ? session.datesLabelHr : session.datesLabelEn,
            })}
          </p>
          <p>{t("groupSize", { seats: session.totalSeats })}</p>
          <p>{t("enrollBy", { date: deadline })}</p>
          {session.open ? (
            <p className="inline-flex items-center gap-2 text-secondary font-medium">
              <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
              {t("openNow")}
            </p>
          ) : (
            <p className="text-primary font-medium">
              {session.seatsLeft <= 0 ? t("soldOut") : t("closed")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
