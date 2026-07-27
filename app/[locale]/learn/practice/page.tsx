import { notFound } from "next/navigation";

import { PracticeStudio } from "@/components/learn/LearningCenterV22";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PracticeStudio locale={locale} />;
}
