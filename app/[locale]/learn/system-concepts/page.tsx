import { notFound } from "next/navigation";

import { SystemConceptsTrack } from "@/components/learn/SystemConceptsTrack";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SystemConceptsTrack locale={locale} />;
}
