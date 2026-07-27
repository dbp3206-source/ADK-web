import { notFound } from "next/navigation";

import { AboutPageV2 } from "@/components/pages/PortfolioPages";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AboutPageV2 locale={locale} />;
}
