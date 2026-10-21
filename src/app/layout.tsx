import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { editorial, site } from "@/content/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: editorial.metadata.title,
  description: editorial.metadata.description,
  metadataBase: new URL(site.domain),
  alternates: { canonical: "/" },
  icons: { icon: "/brand.svg" },
  openGraph: {
    title: editorial.metadata.title,
    description: editorial.metadata.description,
    url: site.domain,
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: [{ url: "/profile.jpg", alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: editorial.metadata.title,
    description: editorial.metadata.description,
    images: ["/profile.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
