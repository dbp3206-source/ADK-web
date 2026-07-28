import { notFound } from "next/navigation";
import { CaseStudyV3 } from "@/components/case-study/CaseStudyV3";
import { projects } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ["vi", "en"]) {
    for (const project of projects) {
      params.push({ locale, slug: project.slug });
    }
  }
  return params;
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !projects.some((p) => p.slug === slug)) {
    notFound();
  }
  return <CaseStudyV3 slug={slug} locale={locale as Locale} />;
}
