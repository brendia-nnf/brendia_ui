"use client";

import { useTranslations } from "next-intl";

// Zajednički blokovi nove ponude (faza 1 redizajna, upute klijentice
// 29.10.2026). Tekstovi su duplicirani pod "coursesPage" i "courseDetail"
// namespace-ovima, pa svaki blok prima namespace kroz `ns`.

interface BlockProps {
  ns: "coursesPage" | "courseDetail";
}

// Rate po bankama — brojevi su isti na oba jezika, prevode se samo
// zaglavlja i "Bez kamata". NAPOMENA: uvjete po bankama klijentica
// potvrđuje s Monrijem prije objave.
const BANK_ROWS = [
  { bank: "Privredna banka Zagreb: Maestro, Visa Premium, Visa", above80: "2–6", above500: "2–12", above1500: "2–36" },
  { bank: "Zagrebačka banka: Visa AM i Visa Business", above80: "2–6", above500: "2–12", above1500: "2–36**" },
  { bank: "Zagrebačka banka: Maestro, Visa debitna kartica, Mastercard", above80: "2–6", above500: "2–12", above1500: "2–24" },
  { bank: "Erste&Steiermärkische Bank: Mastercard, Maestro, Visa", above80: "2–6", above500: "2–12", above1500: "2–12" },
  { bank: "Erste&Steiermärkische Bank: Diners Club i Discover", above80: "2–6", above500: "2–12", above1500: "2–36" },
];

export function PaymentMethodsBlock({ ns }: BlockProps) {
  const t = useTranslations(`${ns}.paymentMethods`);

  return (
    <div id="payment-methods" className="bg-white p-8 md:p-10 scroll-mt-24">
      <h3 className="text-2xl font-heading text-primary mb-4">{t("title")}</h3>
      <p className="text-primary/70 mb-3">{t("intro")}</p>
      <ul className="space-y-2 mb-8">
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex items-start gap-3">
            <svg className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-primary/70 text-sm">{t(`bullets.${i}`)}</span>
          </li>
        ))}
      </ul>

      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-primary/15">
              <th className="text-left py-3 pr-4 font-heading text-primary font-normal">{t("table.cards")}</th>
              <th className="text-center py-3 px-3 font-heading text-primary font-normal">{t("table.above80")}</th>
              <th className="text-center py-3 px-3 font-heading text-primary font-normal">{t("table.above500")}</th>
              <th className="text-center py-3 px-3 font-heading text-primary font-normal">{t("table.above1500")}</th>
              <th className="text-center py-3 pl-3 font-heading text-primary font-normal">{t("table.interest")}</th>
            </tr>
          </thead>
          <tbody>
            {BANK_ROWS.map((row, i) => (
              <tr key={i} className="border-b border-primary/5">
                <td className="py-3 pr-4 text-primary/80">{row.bank}</td>
                <td className="py-3 px-3 text-center text-primary/70">{row.above80}</td>
                <td className="py-3 px-3 text-center text-primary/70">{row.above500}</td>
                <td className="py-3 px-3 text-center text-primary/70">{row.above1500}</td>
                <td className="py-3 pl-3 text-center text-primary/70">{t("table.interestFree")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-primary/50 mt-4">{t("note")}</p>
    </div>
  );
}

export function RefundPolicyBlock({ ns }: BlockProps) {
  const t = useTranslations(`${ns}.refundPolicy`);

  return (
    <div className="bg-white p-8 md:p-10">
      <h3 className="text-2xl font-heading text-primary mb-6">{t("title")}</h3>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-3">
            {t("online.title")}
          </p>
          <p className="text-primary/70 text-sm leading-relaxed">
            <span className="font-medium text-primary">{t("online.heading")}</span>{" "}
            {t("online.content")}
          </p>
        </div>
        <div>
          <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-3">
            {t("live.title")}
          </p>
          <p className="text-primary/70 text-sm leading-relaxed">
            <span className="font-medium text-primary">{t("live.heading")}</span>{" "}
            {t("live.content")}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MasterclassBlock({ ns }: BlockProps) {
  const t = useTranslations(`${ns}.masterclass`);

  return (
    <div className="bg-primary text-white p-8 md:p-10">
      <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-3">
        {t("title")}
      </p>
      <p className="text-white/80 leading-relaxed">
        <span className="font-medium text-white">{t("heading")}</span>{" "}
        {t("content")}
      </p>
    </div>
  );
}

// Kako do certifikata (2.6) — stranica online programa
export function HowToCertificateBlock() {
  const t = useTranslations("courseDetail.howToCertificate");

  return (
    <div className="bg-white p-8 md:p-10">
      <h3 className="text-2xl font-heading text-primary mb-8">{t("title")}</h3>
      <ol className="space-y-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <li key={i} className="flex items-start gap-4">
            <span className="w-8 h-8 flex-shrink-0 bg-secondary text-white flex items-center justify-center font-heading">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-primary mb-1">
                {t(`steps.${i}.title`)}
              </p>
              <p className="text-primary/70 text-sm leading-relaxed">
                {t(`steps.${i}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Vrijednost vještine + Profesionalna kupnja (2.8) — stranice programa
export function ValueOfSkillBlock() {
  const t = useTranslations("courseDetail.valueOfSkill");

  return (
    <div className="bg-cream p-8 md:p-10">
      <h3 className="text-2xl font-heading text-primary mb-4">{t("title")}</h3>
      <p className="text-primary/70 leading-relaxed mb-4">
        <span className="font-medium text-primary">{t("heading")}</span>{" "}
        {t("content")}
      </p>
      <p className="text-primary/50 text-xs leading-relaxed">{t("disclaimer")}</p>
    </div>
  );
}

export function ProfessionalPurchaseBlock() {
  const t = useTranslations("courseDetail.professionalPurchase");

  return (
    <div className="bg-cream p-8 md:p-10">
      <h3 className="text-2xl font-heading text-primary mb-4">{t("title")}</h3>
      <p className="text-primary/70 leading-relaxed">{t("content")}</p>
    </div>
  );
}

export function EducationKitBlock() {
  const t = useTranslations("courseDetail.educationKit");

  return (
    <div className="bg-cream p-8 md:p-10">
      <p className="text-secondary text-sm font-medium tracking-widest uppercase mb-3">
        {t("title")}
      </p>
      <h3 className="text-2xl font-heading text-primary mb-4">{t("heading")}</h3>
      <p className="text-primary/70 leading-relaxed mb-4">{t("content")}</p>
      <p className="text-primary/60 text-sm leading-relaxed mb-4">{t("note")}</p>
      <p className="text-primary font-heading text-lg">{t("value")}</p>
    </div>
  );
}
