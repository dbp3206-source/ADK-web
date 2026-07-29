import { notFound } from "next/navigation";

import { LearningCenterV33 } from "@/components/learn/LearningCenterV33";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LearningCenterV33 locale={locale} mode="practical" />;
}
