import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-navy text-slate">
        {children}
      </body>
    </html>
  );
}
