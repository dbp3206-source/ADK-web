"use client";

import { useState } from "react";

import { StaticLink as Link } from "@/components/layout/StaticLink";
import type { Lesson } from "@/lib/types";

export function LessonView({ lesson }: { lesson: Lesson }) {
  const [mode, setMode] = useState<"quick" | "detail">("quick");
  const [answers, setAnswers] = useState<Record<number, number>>({});

  return (
    <>
      <div className="lesson-mode" role="group" aria-label="Lesson reading duration">
        <button type="button" aria-pressed={mode === "quick"} onClick={() => setMode("quick")}>60-second version</button>
        <button type="button" aria-pressed={mode === "detail"} onClick={() => setMode("detail")}>5-minute version</button>
      </div>

      {mode === "quick" ? (
        <ol className="lesson-quick">
          {lesson.quick.map((item, index) => (
            <li key={item}><span className="mono">{index + 1}</span><p>{item}</p></li>
          ))}
        </ol>
      ) : (
        <div className="lesson-detail">
          {lesson.detail.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      )}

      <section className="lesson-evidence">
        <h2>Evidence boundary</h2>
        <p>Concepts are sourced from the package PDFs. Repository code evidence remains pending verification.</p>
        <Link href={`/projects/${lesson.relatedProject}`}>Open the related case study</Link>
      </section>

      <section className="self-check" aria-labelledby="self-check-title">
        <h2 id="self-check-title">Three-question self-check</h2>
        {lesson.checks.map((check, questionIndex) => {
          const chosen = answers[questionIndex];
          return (
            <fieldset key={check.question}>
              <legend>{check.question}</legend>
              {check.options.map((option, optionIndex) => (
                <label key={option}>
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    checked={chosen === optionIndex}
                    onChange={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                  />
                  <span>{option}</span>
                </label>
              ))}
              {chosen !== undefined ? (
                <p className={chosen === check.answer ? "quiz-correct" : "quiz-incorrect"} aria-live="polite">
                  {chosen === check.answer ? "Correct. " : "Not yet. "}{check.explanation}
                </p>
              ) : null}
            </fieldset>
          );
        })}
      </section>
    </>
  );
}
