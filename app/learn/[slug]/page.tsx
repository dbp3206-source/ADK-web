import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StaticLink as Link } from "@/components/layout/StaticLink";
import { LessonView } from "@/components/learn/LessonView";
import { getLesson, lessons } from "@/lib/lessons";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return lesson ? { title: lesson.title, description: lesson.thesis } : {};
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return (
    <article className="page-shell page-top lesson-page">
      <Link className="back-link" href="/learn">← All lessons</Link>
      <header className="page-masthead">
        <p className="eyebrow">LEARN · SOURCE-BASED</p>
        <h1>{lesson.title}</h1>
        <p className="lede">{lesson.thesis}</p>
      </header>
      <LessonView lesson={lesson} />
    </article>
  );
}
