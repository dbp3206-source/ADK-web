import type { Metadata } from "next";
import { StaticLink as Link } from "@/components/layout/StaticLink";

import { glossary } from "@/lib/content";
import { lessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Learn AI Agent Architecture",
  description: "Plain-language lessons and glossary terms grounded in the six ADK project architectures."
};

export default function LearnPage() {
  return (
    <div className="page-shell page-top learn-page">
      <header className="page-masthead">
        <p className="eyebrow">LEARNING LAYER</p>
        <h1>Agent systems, explained through working architecture.</h1>
        <p className="lede">Read the quick version, inspect the deeper explanation and connect each concept to a case study.</p>
      </header>

      <ol className="lesson-index">
        {lessons.map((lesson, index) => (
          <li key={lesson.slug}>
            <span className="mono">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2><Link href={`/learn/${lesson.slug}`}>{lesson.title}</Link></h2>
              <p>{lesson.thesis}</p>
            </div>
            <span className="mono">60 SEC / 5 MIN</span>
          </li>
        ))}
      </ol>

      <section className="glossary-section" aria-labelledby="glossary-title">
        <div className="section-intro">
          <h2 id="glossary-title">Glossary</h2>
          <p>Focus or hover a term for its one-sentence definition. Definitions also remain visible in the document.</p>
        </div>
        <dl className="glossary-list">
          {glossary.map((entry) => (
            <div className="glossary-entry" key={entry.term}>
              <dt tabIndex={0} aria-describedby={`definition-${entry.term.replaceAll(" ", "-")}`}>
                {entry.term}
                <span className="tooltip" role="tooltip">{entry.short}</span>
              </dt>
              <dd id={`definition-${entry.term.replaceAll(" ", "-")}`}>{entry.short}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
