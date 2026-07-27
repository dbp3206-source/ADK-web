import { notFound } from "next/navigation";

import { CaseStudyV2 } from "@/components/case-study/CaseStudyV2";
import { projects } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !projects.some((project) => project.slug === slug)) notFound();
  return <CaseStudyV2 locale={locale} slug={slug} />;
}
