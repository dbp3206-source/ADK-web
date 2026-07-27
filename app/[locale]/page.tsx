import { notFound } from "next/navigation";

import { HomePageV2 } from "@/components/home/HomePageV2";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomePageV2 locale={locale} />;
}
