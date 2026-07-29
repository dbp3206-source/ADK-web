"use client";

import { AgentInteractionSimulator } from "@/components/simulator/AgentInteractionSimulator";
import { AgentCoreExplorer } from "@/components/source/AgentCoreExplorer";
import { RealWorldCaseFrame } from "@/components/case-study/RealWorldCaseFrame";
import caseDataVi from "@/content/case-studies.vi.json";
import { localizeProject } from "@/content/project-copy";
import { projects } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";

type ViCase = (typeof caseDataVi)[number];

export function CaseStudyV3({ slug, locale }: { slug: string; locale: Locale }) {
  const viCase = (caseDataVi as ViCase[]).find((item) => item.slug === slug);
  const project = projects.find((item) => item.slug === slug);
  if (!viCase || !project) return null;

  const copy = localizeProject(project, locale);
  const vi = locale === "vi";
  const labels = {
    situation: vi ? "Tình huống thực tế" : "Real situation",
    problem: vi ? "Vấn đề cần giải quyết" : "Problem to solve",
    insufficient: vi ? "Tại sao cách đơn giản chưa đủ?" : "Why is the simple approach insufficient?",
    outcome: vi ? "Kết quả và giá trị" : "Result and value",
    approach: vi ? "Cách project xử lý" : "How the project handles it",
    simulator: vi ? "Xem agent làm việc" : "Watch the agent work",
    technical: vi ? "Chi tiết kỹ thuật" : "Technical details",
    source: vi ? "Mở source, tests và dữ liệu mô phỏng" : "Open source, tests and simulation data"
  };
  const pain = vi ? viCase.context.pain : copy.limitations.slice(0, 3);
  const decisions = vi
    ? viCase.approach.map((item) => ({
        problem: item.problem,
        decision: item.decision,
        value: viCase.effect.whyItMatters,
        tradeoff: item.tradeoff
      }))
    : copy.decisions.slice(0, 3).map((decision, index) => ({
        problem: pain[index] || copy.problem,
        decision,
        value: copy.whatItProves,
        tradeoff: copy.limitations[index] || copy.safetyNote
      }));

  return (
    <article className={`case-study-v3 case-${slug} project-${slug}`}>
      <header className="case-cover-v3 page-shell-v2">
        <div className="case-index-v2">
          <span className="mono">{String(project.index).padStart(2, "0")}</span>
          <span className="mono">{project.verb}</span>
        </div>
        <div>
          <p className="eyebrow-v2">{copy.vibeName}</p>
          <h1>{copy.title}</h1>
          <p className="case-thesis-v2">{copy.thesis}</p>
        </div>
      </header>

      <div className="case-body-v3 page-shell-v2">
        <RealWorldCaseFrame slug={slug} locale={locale} />

        <section className="case-narrative-section" aria-labelledby="case-problem-title">
          <div>
            <p className="eyebrow-v2">02 · {labels.problem}</p>
            <h2 id="case-problem-title">{labels.insufficient}</h2>
          </div>
          <div className="case-problem-list">
            <ul>{pain.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>

        <section className="case-narrative-section" aria-labelledby="case-approach-title">
          <div>
            <p className="eyebrow-v2">03</p>
            <h2 id="case-approach-title">{labels.approach}</h2>
            <p>{vi ? viCase.context.success : copy.primaryTimeline.slice(0, 4).join(" → ")}</p>
          </div>
          <div className="case-decision-ledger">
            {decisions.map((item, index) => (
              <article key={`${item.decision}-${index}`}>
                <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                <dl>
                  <div><dt>{vi ? "Vấn đề" : "Problem"}</dt><dd>{item.problem}</dd></div>
                  <div><dt>{vi ? "Quyết định" : "Decision"}</dt><dd>{item.decision}</dd></div>
                  <div><dt>{vi ? "Giá trị" : "Value"}</dt><dd>{item.value}</dd></div>
                  <div><dt>{vi ? "Đánh đổi" : "Trade-off"}</dt><dd>{item.tradeoff}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="case-simulator-section" aria-labelledby="case-simulator-title">
          <header>
            <p className="eyebrow-v2">04 · INPUT → PROCESS → OUTPUT</p>
            <h2 id="case-simulator-title">{labels.simulator}</h2>
            <p>
              {vi
                ? "Chọn kịch bản, đi từng bước hoặc chạy bản xem nhanh 30 giây."
                : "Choose a scenario, inspect each step or run the 30-second guided view."}
            </p>
          </header>
          <AgentInteractionSimulator slug={slug} locale={locale} />
        </section>

        <section className="case-output-first" aria-labelledby="case-output-title">
          <div>
            <p className="eyebrow-v2">05</p>
            <h2 id="case-output-title">{labels.outcome}</h2>
            <h3>{copy.artifact}</h3>
          </div>
          <div className={`case-output-motif output-${slug}`} aria-hidden="true">
            <i /><i /><i /><i />
          </div>
          <p>{vi ? viCase.effect.whyItMatters : copy.whatItProves}</p>
        </section>

        <details className="case-technical-details">
          <summary>
            <span>{labels.technical}</span>
            <small>{labels.source}</small>
          </summary>
          {slug === "worldcup-analyst" ? (
            <p className="technical-context-note">
              {vi
                ? "Source bên dưới là snapshot lịch sử của project. Demo công khai dùng bộ dữ liệu World Cup 2022 cố định, rà soát lần cuối ngày 2026-07-29 và không cung cấp tỉ số live."
                : "The source below is a historical project snapshot. The public demo uses a fixed 2022 World Cup dataset, last reviewed on 2026-07-29, and does not provide live scores."}
            </p>
          ) : null}
          {slug === "love-advisor" ? (
            <p className="technical-context-note">
              {vi
                ? "Source lịch sử được giữ để đối chiếu. Demo công khai chỉ dùng sở thích giao tiếp và lập kế hoạch, không chấm ngoại hình hoặc chẩn đoán."
                : "Historical source is preserved for inspection. The public demo only uses communication and planning preferences, with no appearance scoring or diagnosis."}
            </p>
          ) : null}
          <AgentCoreExplorer locale={locale} initialProject={slug} compact />
        </details>

        <nav className="case-next-actions" aria-label={vi ? "Đi tiếp" : "Continue"}>
          <a href={localizedPath(locale, "/projects")}>{vi ? "Xem sáu project" : "View all projects"} →</a>
          <a href={localizedPath(locale, "/learn/projects")}>{vi ? "Học từ project này" : "Learn from this project"} →</a>
        </nav>
      </div>
    </article>
  );
}
