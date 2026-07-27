import { ArtifactGallery, CapabilityLadderV2, HomeHero, PatternComparator } from "@/components/home/HomeInteractive";
import { LazyProjectLab } from "@/components/labs/LazyProjectLab";
import { StaticLink as Link } from "@/components/layout/StaticLink";
import { localizeProject, patternByProject } from "@/content/project-copy";
import { projects } from "@/lib/content";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";
import { getUtilityLinks } from "@/lib/site";

export function HomePageV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const dashboard = projects.find((project) => project.slug === "dashboard-insights")!;
  const a2a = projects.find((project) => project.slug === "a2a-orchestrator")!;
  const others = projects.filter((project) => !["dashboard-insights", "a2a-orchestrator"].includes(project.slug));
  const utilityLinks = getUtilityLinks();
  return (
    <div className="v2-page">
      <HomeHero locale={locale} />
      <CapabilityLadderV2 locale={locale} />

      <section className="recruiter-snapshot page-shell-v2" aria-labelledby="snapshot-title">
        <div>
          <p className="eyebrow-v2">RECRUITER · 03 MIN</p>
          <h2 id="snapshot-title">{dict.home.recruiterTitle}</h2>
        </div>
        <p>{dict.home.recruiterCopy}</p>
        <dl>
          <div><dt>Google ADK</dt><dd>tool · state · delegation · workflow</dd></div>
          <div><dt>Python systems</dt><dd>MCP · RAG · validation · artifact</dd></div>
          <div><dt>A2A</dt><dd>capability contract · routing · fallback</dd></div>
        </dl>
      </section>

      <section className="featured-lab featured-dashboard-v2 page-shell-v2" id="featured-dashboard" aria-labelledby="dashboard-feature-title">
        <header className="section-head-v2">
          <p className="eyebrow-v2">05 · VERIFY · FEATURED</p>
          <h2 id="dashboard-feature-title">{dict.home.featuredDashboard}</h2>
          <p>{localizeProject(dashboard, locale).thesis}</p>
        </header>
        <LazyProjectLab slug="dashboard-insights" locale={locale} />
        <Link href={localizedPath(locale, "/projects/dashboard-insights")}>{dict.common.openProject} →</Link>
      </section>

      <section className="featured-lab featured-a2a-v2 page-shell-v2" id="featured-a2a" aria-labelledby="a2a-feature-title">
        <header className="section-head-v2">
          <p className="eyebrow-v2">06 · CONNECT · CONTROL PLANE</p>
          <h2 id="a2a-feature-title">{dict.home.featuredA2A}</h2>
          <p>{localizeProject(a2a, locale).thesis}</p>
        </header>
        <LazyProjectLab slug="a2a-orchestrator" locale={locale} />
        <Link href={localizedPath(locale, "/projects/a2a-orchestrator")}>{dict.common.openProject} →</Link>
      </section>

      <section className="editorial-rows-v2 page-shell-v2" aria-labelledby="remaining-title">
        <header className="section-head-v2">
          <p className="eyebrow-v2">PROJECT FILES · 01—04</p>
          <h2 id="remaining-title">{locale === "vi" ? "Bốn phép thử kiến trúc nền." : "Four foundational architecture experiments."}</h2>
        </header>
        {others.map((project) => {
          const copy = localizeProject(project, locale);
          return (
            <article className={`editorial-row-v2 project-${project.slug}`} key={project.slug}>
              <span className="editorial-index mono">{String(project.index).padStart(2, "0")}</span>
              <div><span className="eyebrow-v2">{project.verb}</span><h3>{copy.title}</h3><p>{copy.thesis}</p></div>
              <div className={`mini-signal mini-${project.slug}`} aria-hidden="true"><i /><i /><i /><i /></div>
              <div><span className="mono">{patternByProject[project.slug]}</span><p>{copy.artifact}</p><Link href={localizedPath(locale, `/projects/${project.slug}`)}>{dict.common.openProject} →</Link></div>
            </article>
          );
        })}
      </section>

      <ArtifactGallery locale={locale} />
      <PatternComparator locale={locale} />

      <section className="evidence-bridge-v2 page-shell-v2">
        <div><p className="eyebrow-v2">TRUST LAYER</p><h2>{dict.home.evidenceBridge}</h2></div>
        <div className="evidence-states-v2">
          <span>{dict.evidence.labels.documented}</span>
          <span>{dict.evidence.labels.located}</span>
          <span>{dict.evidence.labels.verified}</span>
          <span>{dict.evidence.labels.proposed}</span>
          <span>{dict.evidence.labels.pending}</span>
        </div>
        <p>{locale === "vi" ? "Source excerpt chỉ xuất hiện khi có đường dẫn và commit đã xác minh. Hiện tại, các trace và artifact đều được ghi rõ là mô phỏng từ kiến trúc." : "Source excerpts appear only with a verified path and commit. Current traces and artifacts are explicitly labeled as architecture simulations."}</p>
        <Link href={localizedPath(locale, "/evidence")}>{dict.nav.evidence} →</Link>
      </section>

      <section className="contact-terminal-v2 page-shell-v2">
        <span className="mono">$ open-to --scope agent-systems</span>
        <h2>{dict.home.contact}</h2>
        <p>Google ADK · Python · Applied AI · A2A</p>
        <div>
          <Link href={localizedPath(locale, "/contact")}>{dict.nav.contact} →</Link>
          {utilityLinks.map((link) => <a href={link.href} key={link.label}>{link.label} ↗</a>)}
        </div>
      </section>
    </div>
  );
}
