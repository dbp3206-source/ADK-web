import { notFound } from "next/navigation";

import { LearningOverview } from "@/components/learn/LearningCenterV22";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LearningOverview locale={locale} />;
}
