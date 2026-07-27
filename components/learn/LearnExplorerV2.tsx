"use client";

import { useMemo, useState } from "react";

import { getLocalizedLessons } from "@/content/lessons-v2";
import { glossary } from "@/lib/content";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";

const viGlossary: Record<string, string> = {
  Agent: "Một hệ thống dùng model để quyết định và hành động qua tool hoặc handoff.",
  Tool: "Hàm thực thi có contract input/output rõ.",
  State: "Dữ liệu có cấu trúc được giữ trong phạm vi một phiên hoặc workflow.",
  Transfer: "Cơ chế chuyển quyền điều khiển sang specialist tiếp theo.",
  AgentTool: "Một specialist được root agent gọi như một tool có biên.",
  Workflow: "Thứ tự phối hợp được mã hóa thay vì để model tự quyết toàn bộ.",
  MCP: "Protocol nối agent với tool và nguồn dữ liệu.",
  A2A: "Protocol nối các agent service độc lập.",
  "Agent Card": "Capability contract công bố danh tính, endpoint, input và output của agent.",
  Artifact: "Đầu ra có cấu trúc hoặc bền vững của một task."
};

export function LearnExplorerV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const lessons = getLocalizedLessons(locale);
  const [term, setTerm] = useState("");
  const terms = useMemo(() => glossary.map((item) => ({
    term: item.term,
    short: locale === "vi" ? (viGlossary[item.term] ?? item.short) : item.short
  })).filter((item) => `${item.term} ${item.short}`.toLowerCase().includes(term.toLowerCase())), [locale, term]);
  return (
    <>
      <section className="lesson-index-v2">
        {lessons.map((lesson, index) => <article key={lesson.slug}><span className="mono">{String(index + 1).padStart(2, "0")}</span><div><h2>{lesson.title}</h2><p>{lesson.thesis}</p><ul>{lesson.quick.slice(0, 2).map((item) => <li key={item}>{item}</li>)}</ul><a href={localizedPath(locale, `/learn/${lesson.slug}`)}>{dict.learn.deep} →</a></div></article>)}
      </section>
      <section className="glossary-v2" aria-labelledby="glossary-title">
        <header><p className="eyebrow-v2">GLOSSARY</p><h2 id="glossary-title">{dict.learn.glossary}</h2></header>
        <label><span>{dict.learn.search}</span><input name="glossary-search" type="search" value={term} onChange={(event) => setTerm(event.target.value)} /></label>
        <p className="sr-only" aria-live="polite">{terms.length}</p>
        {terms.length ? <dl>{terms.map((item) => <div key={item.term}><dt>{item.term}</dt><dd>{item.short}</dd></div>)}</dl> : <p>{dict.learn.noResult}</p>}
      </section>
    </>
  );
}
