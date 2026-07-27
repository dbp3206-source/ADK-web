import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { CommandDeck } from "@/components/command/CommandDeck";
import { LegacyRouteRedirect } from "@/components/layout/LegacyRouteRedirect";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

import "./globals.css";
import "./v2.css";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
  display: "swap"
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap"
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false
});

export const metadata: Metadata = {
  title: {
    default: "ADK Agent Ecosystem Portfolio",
    template: "%s — ADK Agent Ecosystem"
  },
  description:
    "Six Google ADK and Python projects progressing from tools and state to workflow composition, retrieval, QA loops and A2A orchestration.",
  openGraph: {
    title: "ADK Agent Ecosystem Portfolio",
    description: "Not six chatbots. Six architectural steps toward an agent ecosystem.",
    type: "website",
    locale: "vi_VN"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F4F7FA"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
        <LegacyRouteRedirect />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <CommandDeck />
      </body>
    </html>
  );
}
