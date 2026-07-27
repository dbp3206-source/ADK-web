"use client";

import { useState } from "react";

import type { Lesson } from "@/lib/types";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";

export function LessonV2({ lesson, locale }: { lesson: Lesson; locale: Locale }) {
  const dict = getDictionary(locale);
  const [mode, setMode] = useState<"quick" | "deep">("quick");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  return (
    <article className="lesson-v2 page-shell-v2">
      <header><p className="eyebrow-v2">{dict.learn.eyebrow}</p><h1>{lesson.title}</h1><p>{lesson.thesis}</p></header>
      <div className="lesson-mode-v2" role="group" aria-label="Reading mode">
        <button type="button" aria-pressed={mode === "quick"} onClick={() => setMode("quick")}>{dict.learn.quick}</button>
        <button type="button" aria-pressed={mode === "deep"} onClick={() => setMode("deep")}>{dict.learn.deep}</button>
      </div>
      <section><h2>{mode === "quick" ? dict.learn.quick : dict.learn.deep}</h2>{mode === "quick" ? <ol>{lesson.quick.map((item) => <li key={item}>{item}</li>)}</ol> : lesson.detail.map((item) => <article key={item.heading}><h3>{item.heading}</h3><p>{item.body}</p></article>)}</section>
      <section className="quiz-v2"><h2>{dict.learn.quiz}</h2>{lesson.checks.map((check, index) => <fieldset key={check.question}><legend>{check.question}</legend>{check.options.map((option, optionIndex) => <label key={option}><input type="radio" name={`quiz-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))} />{option}</label>)}{answers[index] !== undefined ? <p role="status" className={answers[index] === check.answer ? "is-correct" : "is-wrong"}>{answers[index] === check.answer ? "✓ " : "× "}{check.explanation}</p> : null}</fieldset>)}</section>
      <a href={localizedPath(locale, `/projects/${lesson.relatedProject}`)}>{dict.learn.related} →</a>
    </article>
  );
}
