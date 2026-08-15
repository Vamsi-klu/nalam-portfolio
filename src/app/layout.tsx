/**
 * Root layout — the app shell wrapping the single route.
 *
 * Responsibilities, in order of appearance below: load the two fonts and expose them as
 * CSS variables, declare the site's static metadata, set up the flex column that pins
 * the footer to the bottom of short pages, and mount Vercel Web Analytics.
 *
 * This is a Server Component, which is required for the `metadata` export — Next.js only
 * honors `metadata` and `generateMetadata` in Server Components.
 *
 * @see docs/ARCHITECTURE.md
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

/**
 * `next/font` self-hosts these at build time (no runtime request to Google) and emits a
 * `className` plus a CSS variable. Exposing them as variables rather than applying the
 * class directly is what lets `globals.css` wire them into Tailwind's theme as
 * `--font-sans` / `--font-mono`, so `font-sans` and `font-mono` utilities work
 * everywhere.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Static metadata for the one route.
 *
 * `metadataBase` resolves relative URLs in OG/Twitter tags to absolute ones, which
 * social crawlers require. It hardcodes the production domain, so preview deployments
 * advertise the production URL — acceptable for a portfolio, but note the domain also
 * appears in `openGraph.url` here and in `site.domain`, so a domain change means editing
 * three places.
 *
 * Gap: `twitter.card` is `summary_large_image` but no OG image exists, so share cards
 * currently render without one. Adding `src/app/opengraph-image.tsx` (or a static
 * `opengraph-image.png`) would fix it.
 *
 * @see node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md
 */
export const metadata: Metadata = {
  title: "Ramachandra Nalam | Data Engineer",
  description:
    "Data Engineer specializing in product analytics, real-time pipelines, and scalable data platforms. Kafka · Spark · Airflow · Snowflake · dbt.",
  metadataBase: new URL("https://nalamportfolio.dev"),
  openGraph: {
    title: "Ramachandra Nalam | Data Engineer",
    description:
      "Product Analytics · Real-time Pipelines · Scalable Platforms. 100+ upstream OSS PRs.",
    url: "https://nalamportfolio.dev",
    siteName: "Ramachandra Nalam",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ramachandra Nalam | Data Engineer",
    description:
      "Product Analytics · Real-time Pipelines · Scalable Platforms.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `h-full` on <html> plus `min-h-full flex flex-col` on <body> is what lets the
    // footer sit at the bottom of the viewport when content is short, while still
    // flowing normally when content is tall.
    //
    // No `data-scroll-behavior="smooth"` here on purpose. Next.js 16 stopped overriding
    // CSS `scroll-behavior` during router navigations unless that attribute is present;
    // this site has a single route and only anchor links, so there are no router
    // navigations to override and the smooth scrolling set in globals.css just works.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-navy text-slate">
        {children}
        {/*
          Vercel Web Analytics. Imported from `@vercel/analytics/next` rather than the
          bare package — the framework entry point is what hooks App Router navigation.
          It only reports from deployments on Vercel, so seeing nothing locally is
          expected, and it needs Web Analytics enabled for the project in the dashboard.
        */}
        <Analytics />
      </body>
    </html>
  );
}
