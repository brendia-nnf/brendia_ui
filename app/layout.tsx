import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brendia Pro® | Premium Weft Extensions Education",
    template: "%s | Brendia Pro®",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
  },
  description:
    "Master the art of weft extensions with Brendia Pro®'s premium certification courses. Learn from expert educator Nikolina Kljaić and transform your career.",
  keywords: [
    "weft extensions",
    "hair extensions",
    "hair education",
    "certification courses",
    "Nikolina Kljaić",
    "Brendia Pro®",
    "professional hair training",
  ],
  authors: [{ name: "Nikolina Kljaić" }],
  creator: "Brendia Pro®",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brendiapro.com",
    siteName: "Brendia Pro®",
    title: "Brendia Pro® | Premium Weft Extensions Education",
    description:
      "Master the art of weft extensions with Brendia Pro®'s premium certification courses.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brendia Pro® - Premium Weft Extensions Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brendia Pro® | Premium Weft Extensions Education",
    description:
      "Master the art of weft extensions with Brendia Pro®'s premium certification courses.",
    images: ["/images/og-image.jpg"],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://brendiapro.com"
  ),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased bg-white text-primary">
        {children}
      </body>
    </html>
  );
}
