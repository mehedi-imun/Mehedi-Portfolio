import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri, Literata, Tiro_Bangla } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import Header from "@/components/Header";
import TopTicker from "@/components/TopTicker";
import { personSchema, websiteSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/*
 * Literata is the reading face: it was engineered for Google Play Books, so it
 * is tuned for continuous long-form text rather than for headlines. Only .prose
 * consumes it, through --serif-stack in globals.css, which is the Medium model
 * -- sans headings over a serif body. Italic ships too because emphasis inside an article is
 * common and a synthesised oblique serif looks wrong.
 */
const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
  /*
   * preload:false for the same reason as the Bengali faces below, but on a
   * route basis rather than a script one: only .prose consumes this, and .prose
   * exists on two routes. Preloading it (the next/font default) put four
   * render-blocking font preloads -- normal and italic, latin and latin-ext --
   * on the home page, which has no article text to render with them. The
   * size-adjusted fallback next/font generates keeps the swap from shifting
   * layout, so an article pays one extra round trip and nothing else does.
   */
  preload: false,
});

/*
 * Geist has no Bengali glyphs, so Bengali codepoints fall through to these
 * faces automatically, per character -- no per-post font switching. Latin stays
 * on Geist/Literata because they come first in --sans-stack / --serif-stack
 * (see globals.css).
 *
 * Two Bengali faces, mirroring the Latin split: Hind Siliguri is a digital-UI
 * Bangla face and backs the sans stack (chrome, headings, cards); Tiro Bangla
 * is a book serif from the Murty Classical Library lineage and backs the serif
 * stack, so Bangla article bodies read as typeset prose rather than as UI text.
 *
 * preload:false is deliberate on both: next/font emits @font-face with
 * unicode-range, so the browser only fetches these when Bengali characters are
 * actually on the page. An English-only page pays nothing. Preloading would
 * download them everywhere and undo that.
 */
const hindSiliguri = Hind_Siliguri({
  variable: "--font-bengali-sans",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

const tiroBangla = Tiro_Bangla({
  variable: "--font-bengali-serif",
  subsets: ["bengali"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    // Child pages set only their own title; the brand suffix is appended here.
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@mehediimun",
  },
  /*
   * icon.svg lives in public/, so Next's app/ file conventions do not pick it up
   * automatically -- these paths have to be declared explicitly. Declaring
   * `icons` also suppresses auto-detection of app/apple-icon.tsx, so the
   * generated PNG route is listed here by URL too.
   */
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
       * Feed discovery. Deliberately a real element rather than
       * `alternates.types` in the metadata above: Next replaces the whole
       * `alternates` object when a child page sets its own `canonical`, and
       * every page here does, so metadata-declared types would reach no page.
       * React hoists this into <head> on every route.
       */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${siteConfig.name} - Blog`}
        href="/rss.xml"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${literata.variable} ${hindSiliguri.variable} ${tiroBangla.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopTicker />
          <Header />
          {children}
        </ThemeProvider>
        <JsonLd schema={[personSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
