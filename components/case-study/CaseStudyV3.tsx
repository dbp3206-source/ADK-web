"use client";

import { StaticLink as Link } from "@/components/layout/StaticLink";
import { AgentInteractionSimulator } from "@/components/simulator/AgentInteractionSimulator";
import { AgentCoreExplorer } from "@/components/source/AgentCoreExplorer";
import caseDataVi from "@/content/case-studies.vi.json";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";

export function CaseStudyV3({ slug, locale }: { slug: string; locale: Locale }) {
  // Currently we only have VI case study data from handoff, fallback to VI if EN is missing
  const dataList = caseDataVi as any[];
  const caseData = dataList.find(c => c.slug === slug);
  
  if (!caseData) return null;
  const dict = getDictionary(locale);

  return (
    <article className={`case-study-v3 case-${slug} project-${slug}`}>
      <header className="case-cover-v3 page-shell-v2">
        <div className="case-index-v2">
          <span className="mono">{String(caseData.index).padStart(2, "0")}</span>
          <span className="mono">{caseData.verb}</span>
        </div>
        <div>
          <p className="eyebrow-v2">{caseData.visual.motif}</p>
          <h1>{caseData.title}</h1>
          <p className="case-thesis-v2">{caseData.oneLine}</p>
        </div>
      </header>

      <div className="case-body-v3 page-shell-v2">
        <div className="case-content-v3">
          
          <section id="context" className="case-section-v3">
            <span className="section-number mono">C — Context</span>
            <div>
              <h2>Bối cảnh & Tình huống</h2>
              <p className="large-copy-v2">{caseData.context.userSituation}</p>
              
              <div className="pain-points-v3">
                <h3>Vấn đề hiện tại:</h3>
                <ul>
                  {caseData.context.pain.map((p: string, i: number) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </div>
          </section>

          <section id="aim" className="case-section-v3">
            <span className="section-number mono">A — Aim & Problem</span>
            <div>
              <h2>Mục tiêu & Vấn đề</h2>
              <p><strong>Mục tiêu:</strong> {caseData.discoveryProblem}</p>
              <div className="success-def-v3">
                <h3>Định nghĩa thành công:</h3>
                <p>{caseData.context.success}</p>
              </div>
            </div>
          </section>

          <section id="system" className="case-section-v3">
            <span className="section-number mono">S — System & Solution</span>
            <div>
              <h2>Hệ thống & Giải pháp</h2>
              
              <div className="approach-grid-v3">
                {caseData.approach.map((app: any, i: number) => (
                  <div key={i} className="approach-card">
                    <h4>Vấn đề thiết kế</h4>
                    <p>{app.problem}</p>
                    <h4>Quyết định</h4>
                    <p>{app.decision}</p>
                    <p className="tradeoff mono">Tradeoff: {app.tradeoff}</p>
                  </div>
                ))}
              </div>

              <div className="simulator-embed-v3">
                <h3>{locale === "vi" ? "Mô phỏng Agent" : "Agent Simulator"}</h3>
                <AgentInteractionSimulator slug={slug} locale={locale} />
              </div>
            </div>
          </section>

          <section id="effect" className="case-section-v3">
            <span className="section-number mono">E — Effect</span>
            <div>
              <h2>Kết quả & Giá trị</h2>
              <dl className="effect-dl-v3">
                <div><dt>Artifact sinh ra</dt><dd>{caseData.effect.artifact}</dd></div>
                <div><dt>Năng lực kiến trúc</dt><dd>{caseData.effect.capability}</dd></div>
                <div><dt>Tại sao quan trọng</dt><dd>{caseData.effect.whyItMatters}</dd></div>
              </dl>
              <div className="takeaway-v3">
                <h3>Takeaway</h3>
                <p>{caseData.effect.takeaway}</p>
              </div>
            </div>
          </section>

          <section id="engineering" className="case-section-v3">
            <span className="section-number mono">+ Engineering</span>
            <div>
              <h2>Chi tiết kỹ thuật</h2>
              <AgentCoreExplorer locale={locale} initialProject={slug} compact />
            </div>
          </section>

        </div>
      </div>
    </article>
  );
}
