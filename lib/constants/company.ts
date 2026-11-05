// Podaci o tvrtki — jedini izvor istine za footer i pravne stranice.
export const COMPANY = {
  name: "OMEGA-NI d.o.o.",
  street: "Ulica Ladislava Šabana 24",
  city: "10360 Sesvete",
  country: "Hrvatska",
  oib: "24477900978",
  vatId: "HR24477900978",
  mbs: "080887738",
  registryCourt: "Trgovački sud u Zagrebu",
  shareCapital: "2.500,00 EUR (uplaćen u cijelosti)",
  director: "Nikolina Kljaić",
  email: "info@brendiapro.hr",
  phone: "+385 91 155 2000",
  phoneHref: "tel:+385911552000",
} as const;

// Kartice koje prodajno mjesto prihvaća. OTP pravila: smiju se navoditi
// samo kartice kojima je plaćanje stvarno moguće; oznaka ® uz Mastercard
// i Maestro, Maestro odmah iza Mastercarda bez druge kartice između.
// Monri profil (PBZ/ZABA/OTP) prihvaća samo Visa/Mastercard/Maestro.
export const IS_MONRI_MODE = process.env.NEXT_PUBLIC_PAYMENT_MODE === "monri";

export const ACCEPTED_CARDS = IS_MONRI_MODE
  ? "Visa, Mastercard® i Maestro®"
  : "Visa, Mastercard®, Maestro®, American Express, Diners i Discover";
