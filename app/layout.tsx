import type { Metadata } from "next";
import { Be_Vietnam_Pro, Chakra_Petch, Geist_Mono } from "next/font/google";
import { SiteFooter, SiteHeader, SkipLink } from "@/components/layout/SiteLayout";
import { site } from "@/libs/content/site";
import "./globals.css";

const bodyFont = Be_Vietnam_Pro({ variable: "--font-body", subsets: ["vietnamese"], weight: ["400", "500", "600", "700"] });
const headingFont = Chakra_Petch({ variable: "--font-heading", subsets: ["vietnamese"], weight: ["400", "600", "700"] });
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
    >
      <body className="min-h-full">
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
