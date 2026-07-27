import { notFound } from "next/navigation";

import { LearningPaths } from "@/components/learn/LearningCenterV22";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LearningPaths locale={locale} />;
}
