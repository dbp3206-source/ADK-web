import { notFound } from "next/navigation";

import { LessonV2 } from "@/components/learn/LessonV2";
import { getLocalizedLesson, getLocalizedLessons } from "@/content/lessons-v2";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return getLocalizedLessons("en").map((lesson) => ({ slug: lesson.slug }));
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const lesson = getLocalizedLesson(slug, locale);
  if (!lesson) notFound();
  return <LessonV2 lesson={lesson} locale={locale} />;
}
