import type { Metadata } from "next";

// Meta naslovi i opisi po stranici (3.1) — HR tekstovi iz uputa
// klijentice (29.10.2026), EN prijevodi. Naslovi su apsolutni (bez
// "%s | Brendia Pro®" template-a) jer već sadrže brend.
type PageMeta = { title: string; description: string };

const META: Record<string, { hr: PageMeta; en: PageMeta }> = {
  method: {
    hr: {
      title: "Brendia Pro® metoda | Šivane weft ekstenzije",
      description:
        "Profesionalna metoda šivanih weft ekstenzija bez topline i ljepila. Usporedba s keratinom i trakama te radovi iz Studio One by Nina.",
    },
    en: {
      title: "Brendia Pro® method | Sewn-in weft extensions",
      description:
        "A professional method of sewn-in weft extensions without heat or glue. Comparison with keratin and tape-ins, plus work from Studio One by Nina.",
    },
  },
  courses: {
    hr: {
      title: "Tečajevi za weft ekstenzije | Brendia Pro®",
      description:
        "Pet programa: online, online uz dan s Nikolinom, grupna i 1:1 edukacija uživo. Usporedite sadržaj i cijene te odaberite svoj.",
    },
    en: {
      title: "Weft extension courses | Brendia Pro®",
      description:
        "Five programs: online, online with a day with Nikolina, group and 1:1 in-person education. Compare content and prices and choose yours.",
    },
  },
  "artist-online": {
    hr: {
      title: "Brendia Pro® Artist Online | Online edukacija",
      description:
        "8 video modula i pristup 36 mjeseci kroz Brendia Pro® Academy. Učite šivane weft ekstenzije vlastitim tempom.",
    },
    en: {
      title: "Brendia Pro® Artist Online | Online education",
      description:
        "8 video modules and 36 months of access through the Brendia Pro® Academy. Learn sewn-in weft extensions at your own pace.",
    },
  },
  "artist-online-uzivo": {
    hr: {
      title: "Brendia Pro® Artist Online + uživo",
      description:
        "Online edukacija i jedan dan rada uživo s Nikolinom Kljaić u Studio One by Nina. Teorija vlastitim tempom, praksa uz mentoricu.",
    },
    en: {
      title: "Brendia Pro® Artist Online + in person",
      description:
        "Online education plus one day of in-person work with Nikolina Kljaić at Studio One by Nina. Theory at your own pace, practice with a mentor.",
    },
  },
  "artist-grupna-edukacija": {
    hr: {
      title: "Brendia Pro® Artist | Grupna edukacija uživo",
      description:
        "Dva dana prakse s Nikolinom Kljaić u grupi od 3 do 5 polaznica, u Studio One by Nina. Prva grupa 5. i 6. prosinca 2026.",
    },
    en: {
      title: "Brendia Pro® Artist | Group in-person education",
      description:
        "Two days of practice with Nikolina Kljaić in a group of 3 to 5 participants, at Studio One by Nina. First group 5 and 6 December 2026.",
    },
  },
  "artist-1-na-1-jedan-dan": {
    hr: {
      title: "Brendia Pro® Artist 1:1 | Jedan dan uživo",
      description:
        "Jedan dan individualnog rada s Nikolinom Kljaić, 6 do 8 sati, na vašem modelu u Studio One by Nina.",
    },
    en: {
      title: "Brendia Pro® Artist 1:1 | One day in person",
      description:
        "One day of individual work with Nikolina Kljaić, 6 to 8 hours, on your own model at Studio One by Nina.",
    },
  },
  "artist-1-na-1-dva-dana": {
    hr: {
      title: "Brendia Pro® Artist 1:1 | Dva dana + online",
      description:
        "Dva dana individualnog mentorstva s Nikolinom Kljaić i pristup online edukaciji 36 mjeseci. Najkompletniji Brendia Pro® program.",
    },
    en: {
      title: "Brendia Pro® Artist 1:1 | Two days + online",
      description:
        "Two days of individual mentorship with Nikolina Kljaić and 36 months of access to the online education. The most complete Brendia Pro® program.",
    },
  },
  about: {
    hr: {
      title: "O nama | Nikolina Kljaić i Brendia Pro®",
      description:
        "Više od 20 godina u frizerstvu, od 2020. sa šivanim weft ekstenzijama i više od 350 ugradnji. Upoznajte osnivačicu Brendia Pro® metode.",
    },
    en: {
      title: "About us | Nikolina Kljaić and Brendia Pro®",
      description:
        "More than 20 years in hairdressing, working with sewn-in weft extensions since 2020 and more than 350 installations. Meet the founder of the Brendia Pro® method.",
    },
  },
  faq: {
    hr: {
      title: "Česta pitanja | Brendia Pro® Academy",
      description:
        "Odgovori o upisu, plaćanju na rate, Education Kitu, certifikaciji, masterclassu i edukacijama uživo.",
    },
    en: {
      title: "FAQ | Brendia Pro® Academy",
      description:
        "Answers about enrollment, installment payments, the Education Kit, certification, the masterclass and in-person education.",
    },
  },
  blog: {
    hr: {
      title: "Blog o weft ekstenzijama | Brendia Pro®",
      description:
        "Savjeti za frizere i klijentice: ugradnja, održavanje, usporedba metoda i rad sa šivanim weft ekstenzijama.",
    },
    en: {
      title: "Weft extensions blog | Brendia Pro®",
      description:
        "Advice for hairdressers and clients: installation, maintenance, method comparisons and working with sewn-in weft extensions.",
    },
  },
  contact: {
    hr: {
      title: "Kontakt | Brendia Pro®",
      description:
        "Pitanja o edukaciji ili pomoć pri odabiru programa? Javite nam se, odgovaramo u roku od 24 do 48 sati.",
    },
    en: {
      title: "Contact | Brendia Pro®",
      description:
        "Questions about the education or help choosing a program? Get in touch, we reply within 24 to 48 hours.",
    },
  },
  artists: {
    hr: {
      title: "Certificirane Brendia Pro® Artistice",
      description:
        "Pronađite certificiranu Brendia Pro® Artisticu u svom gradu i salon koji radi šivane weft ekstenzije po Brendia Pro® metodi.",
    },
    en: {
      title: "Certified Brendia Pro® Artists",
      description:
        "Find a certified Brendia Pro® Artist in your city and a salon doing sewn-in weft extensions by the Brendia Pro® method.",
    },
  },
};

// canonical: lokalizirana javna putanja (npr. "/hr/tecajevi"). Obavezna za
// rute čiji se interni path razlikuje od javnog (method/courses), jer
// canonical "./" iz root layouta tamo pokazuje na redirect.
export function pageMetadata(
  locale: string,
  key: string,
  canonical?: string
): Metadata {
  const entry = META[key];
  if (!entry) return {};
  const m = locale === "en" ? entry.en : entry.hr;
  return {
    title: { absolute: m.title },
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
      ...(canonical ? { url: canonical } : {}),
    },
    ...(canonical ? { alternates: { canonical } } : {}),
  };
}
