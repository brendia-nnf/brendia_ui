export type PurchaseType = "direct" | "deposit" | "inquiry";

export interface Course {
  id: string;
  // SEO slug u URL-u (3.3): /hr/tecajevi/[urlSlug] odnosno
  // /en/courses/[urlSlug]. ID ostaje stabilan (narudžbe/enrollmenti).
  urlSlug: string;
  name: string;
  subtitle: string;
  price: number; // in cents, without VAT
  displayPrice: string; // gross price incl. VAT, HR format (e.g. "1.600 €")
  currency: string;
  // How the program is sold:
  //  - "direct":  full online purchase through checkout
  //  - "deposit": checkout charges a 30% deposit (reservation); publicly linked
  //  - "inquiry": no public checkout — "Pošaljite upit za termin" form; after
  //               the date is agreed we send a 30% deposit payment link
  //               (the deposit checkout URL, reachable by direct link only)
  purchase: PurchaseType;
  features: string[];
  image: string;
  // Monthly installment options — only offered when BOTH this and the
  // NEXT_PUBLIC_INSTALLMENTS_ENABLED env flag are on. The customer picks
  // one of the listed counts; per-installment amount is rounded to the
  // nearest cent (totals may differ from the gross price by ±2 cents).
  installments?: { enabled: boolean; counts: number[] };
}

export const VAT_RATE = 0.25; // 25% Croatian VAT

// Deposit rate for live-education reservations (predujam)
export const DEPOSIT_RATE = 0.3;

// New offer (2026-11): five programs, prices communicated INCL. VAT.
// `price` stays net (gross / 1.25) because checkout/invoicing compute VAT
// from the net amount. All gross amounts divide cleanly by 1.25.
export const courses: Record<string, Course> = {
  "foundation-certification": {
    id: "foundation-certification",
    urlSlug: "artist-online",
    name: "Brendia Pro® Artist Online",
    subtitle: "Online edukacija",
    price: 128000, // €1,280 net → €1,600 incl. VAT
    displayPrice: "1.600 €",
    currency: "eur",
    purchase: "direct",
    installments: { enabled: true, counts: [2, 3, 4] },
    image: "/images/courses/foundation.jpg",
    features: [
      "8 video modula kroz Brendia Pro® Academy",
      "Pristup video lekcijama 36 mjeseci",
      "Nikolinin pregled i feedback na završni rad",
      "Brendia Pro® certifikat nakon odobrenog završnog rada",
      "Brendia Pro® Education Kit",
      "Besplatan Brendia Pro® Masterclass",
    ],
  },
  "artist-online-live": {
    id: "artist-online-live",
    urlSlug: "artist-online-uzivo",
    name: "Brendia Pro® Artist Online + uživo",
    subtitle: "Online edukacija + 1 dan uživo",
    price: 240000, // €2,400 net → €3,000 incl. VAT
    displayPrice: "3.000 €",
    currency: "eur",
    purchase: "inquiry",
    image: "/images/courses/foundation.jpg",
    features: [
      "Kompletna online edukacija (8 video modula, 36 mjeseci)",
      "1 dan individualnog rada uživo s Nikolinom (6–8 sati)",
      "Rad u Studio One by Nina",
      "Brendia Pro® certifikat nakon odobrenog završnog rada",
      "Brendia Pro® Education Kit",
      "Besplatan Brendia Pro® Masterclass",
    ],
  },
  "artist-group": {
    id: "artist-group",
    urlSlug: "artist-grupna-edukacija",
    name: "Brendia Pro® Artist grupna edukacija",
    subtitle: "2 dana uživo u maloj grupi",
    price: 176000, // €1,760 net → €2,200 incl. VAT
    displayPrice: "2.200 €",
    currency: "eur",
    purchase: "deposit",
    image: "/images/courses/master.jpg",
    features: [
      "2 dana edukacije uživo u Studio One by Nina",
      "Mala grupa od najviše 5 polaznica",
      "Rad uz Nikolinino mentorstvo",
      "Brendia Pro® Education Kit",
      "Besplatan Brendia Pro® Masterclass",
      "15 % popusta na prvu narudžbu Brendia Pro® kose",
    ],
  },
  "brendia-pro-artist-1v1": {
    id: "brendia-pro-artist-1v1",
    urlSlug: "artist-1-na-1-jedan-dan",
    name: "Brendia Pro® Artist 1:1 – jedan dan",
    subtitle: "Individualna edukacija uživo",
    price: 200000, // €2,000 net → €2,500 incl. VAT
    displayPrice: "2.500 €",
    currency: "eur",
    purchase: "inquiry",
    image: "/images/courses/foundation.jpg",
    features: [
      "1 dan individualnog rada s Nikolinom (6–8 sati, po potrebi i dulje)",
      "Rad na vlastitom modelu",
      "Potpuno individualan pristup",
      "Brendia Pro® Education Kit",
      "Besplatan Brendia Pro® Masterclass",
      "15 % popusta na prvu narudžbu Brendia Pro® kose",
    ],
  },
  "artist-1v1-two-days": {
    id: "artist-1v1-two-days",
    urlSlug: "artist-1-na-1-dva-dana",
    name: "Brendia Pro® Artist 1:1 – dva dana + online",
    subtitle: "Najkompletniji program",
    price: 360000, // €3,600 net → €4,500 incl. VAT
    displayPrice: "4.500 €",
    currency: "eur",
    purchase: "inquiry",
    image: "/images/courses/master.jpg",
    features: [
      "2 dana individualnog rada s Nikolinom",
      "Kompletna online edukacija (8 video modula, 36 mjeseci)",
      "Osobno mentorstvo",
      "Brendia Pro® certifikat nakon odobrenog završnog rada",
      "Brendia Pro® Education Kit",
      "Besplatan Brendia Pro® Masterclass",
    ],
  },
};

export function getCourse(courseId: string): Course | undefined {
  return courses[courseId];
}

export function getCourseByUrlSlug(urlSlug: string): Course | undefined {
  return Object.values(courses).find((c) => c.urlSlug === urlSlug);
}

export function calculatePricing(priceInCents: number) {
  const subtotal = priceInCents;
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;

  return {
    subtotal,
    vat,
    total,
    vatRate: VAT_RATE,
    vatPercentage: Math.round(VAT_RATE * 100),
  };
}

// Deposit (predujam) pricing for live-education reservations: 30% of the
// gross program price, then split back into net + VAT for invoicing.
export function calculateDepositPricing(priceInCents: number) {
  const gross = calculatePricing(priceInCents).total;
  const depositGross = Math.round(gross * DEPOSIT_RATE);
  const depositNet = Math.round(depositGross / (1 + VAT_RATE));

  return {
    subtotal: depositNet,
    vat: depositGross - depositNet,
    total: depositGross,
    programTotal: gross,
    remaining: gross - depositGross,
    vatRate: VAT_RATE,
    vatPercentage: Math.round(VAT_RATE * 100),
  };
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
