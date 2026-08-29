import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
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
 * Geist has no Bengali glyphs, so Bengali codepoints fall through to this face
 * automatically, per character -- no per-post font switching. Latin stays on
 * Geist because it comes first in --font-sans (see globals.css).
 *
 * preload:false is deliberate: next/font emits @font-face with unicode-range,
 * so the browser only fetches this file when Bengali characters are actually on
 * the page. An English-only page pays nothing. Preloading would download it
 * everywhere and undo that.
 */
const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansBengali.variable} antialiased`}
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
