"use client";

import { useEffect, useState } from "react";

import infographicVi from "@/content/project-track-v33/home-infographic.vi.json";
import { localizeProject } from "@/content/project-copy";
import { projects } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";

type InfographicStep = (typeof infographicVi)[number];

export function EcosystemFieldGuide({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const source = infographicVi as InfographicStep[];
  const step = source[active];
  const project = projects[active];
  const copy = localizeProject(project, locale);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % source.length), 1800);
    return () => window.clearInterval(timer);
  }, [autoPlay, source.length]);

  const select = (index: number) => {
    setActive(index);
    setAutoPlay(false);
  };

  return (
    <section className="field-guide page-shell-v2" aria-labelledby="field-guide-title">
      <header className="section-head-v2 field-guide-head">
        <p className="eyebrow-v2">INTERACTIVE AGENT FIELD GUIDE</p>
        <h2 id="field-guide-title">
          {locale === "vi"
            ? "Một yêu cầu tiến hóa thành cả hệ sinh thái như thế nào?"
            : "How does one request evolve into an agent ecosystem?"}
        </h2>
        <p>
          {locale === "vi"
            ? "Chọn một trạm để xem năng lực mới, đầu vào và đầu ra mà project đó bổ sung."
            : "Choose a station to inspect the new capability, input and output added by that project."}
        </p>
      </header>

      <div className={`field-guide-stage project-${project.slug}`}>
        <ol className="field-guide-route" aria-label={locale === "vi" ? "Sáu bước kiến trúc" : "Six architecture steps"}>
          {source.map((item, index) => (
            <li key={item.verb} className={index <= active ? "is-reached" : ""}>
              <button
                type="button"
                aria-pressed={index === active}
                onClick={() => select(index)}
              >
                <span className="field-guide-order mono">{String(item.order).padStart(2, "0")}</span>
                <strong>{item.verb}</strong>
                <span>{projects[index].title}</span>
              </button>
            </li>
          ))}
        </ol>

        <article className="field-guide-inspector" aria-live="polite">
          <div className="field-guide-signal" aria-hidden="true">
            <span>USER</span><i /><strong>{step.verb}</strong><i /><span>OUTPUT</span>
          </div>
          <p className="eyebrow-v2">{step.verb} · {copy.vibeName}</p>
          <h3>{locale === "vi" ? step.question : copy.whatItProves}</h3>
          <p>{locale === "vi" ? step.simpleCapability : copy.thesis}</p>
          <dl>
            <div>
              <dt>{locale === "vi" ? "Yêu cầu mẫu" : "Sample request"}</dt>
              <dd>{locale === "vi" ? step.sampleInput : project.samplePrompt}</dd>
            </div>
            <div>
              <dt>{locale === "vi" ? "Đầu ra nhìn thấy" : "Visible output"}</dt>
              <dd>{locale === "vi" ? step.sampleOutput : copy.artifact}</dd>
            </div>
          </dl>
          <div className="field-guide-actions">
            <a href={localizedPath(locale, `/projects/${project.slug}`)}>
              {locale === "vi" ? "Mở case study" : "Open case study"} →
            </a>
            <button type="button" onClick={() => setAutoPlay((value) => !value)} aria-pressed={autoPlay}>
              {autoPlay
                ? (locale === "vi" ? "Dừng tuyến" : "Pause route")
                : (locale === "vi" ? "Chạy tuyến" : "Play route")}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
