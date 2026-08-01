import type { Metadata } from "next";
import { Unbounded, Geist_Mono } from "next/font/google";
import { SiteFooter, SiteHeader, SkipLink } from "@/components/layout/SiteLayout";
import { site } from "@/libs/content/site";
import "./globals.css";

const bodyFont = Unbounded({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const headingFont = Unbounded({ variable: "--font-heading", subsets: ["latin"], weight: ["400", "600", "700"] });
const monoFont = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${site.displayName} — ${site.tagline}`,
    template: `%s — ${site.displayName}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${bodyFont.variable} ${headingFont.variable} ${monoFont.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
