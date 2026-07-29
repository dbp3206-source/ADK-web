import { CapabilityLadderV2, HomeHero } from "@/components/home/HomeInteractive";
import { EcosystemFieldGuide } from "@/components/home/EcosystemFieldGuide";
import { ProjectDiscoveryDesk } from "@/components/home/ProjectDiscoveryDesk";
import { StaticLink as Link } from "@/components/layout/StaticLink";
import { localizeProject, patternByProject } from "@/content/project-copy";
import { projects } from "@/lib/content";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";
import { getUtilityLinks } from "@/lib/site";

export function HomePageV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const utilityLinks = getUtilityLinks();
  
  return (
    <div className="v2-page">
      <HomeHero locale={locale} />
      <EcosystemFieldGuide locale={locale} />
      <CapabilityLadderV2 locale={locale} />
      
      <ProjectDiscoveryDesk locale={locale} />

      <section className="editorial-rows-v2 page-shell-v2" aria-labelledby="cases-title">
        <header className="section-head-v2">
          <p className="eyebrow-v2">CASE STUDIES · 01—06</p>
          <h2 id="cases-title">{locale === "vi" ? "Sáu dự án kiến trúc." : "Six architecture projects."}</h2>
        </header>
        {projects.map((project) => {
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

      <section className="learning-teaser-v3 page-shell-v2" aria-labelledby="learning-teaser-title">
        <header className="section-head-v2">
          <p className="eyebrow-v2">LEARNING CENTER</p>
          <h2 id="learning-teaser-title">{locale === "vi" ? "Hiểu rõ hơn về kiến trúc." : "Understand the architecture."}</h2>
          <p>{locale === "vi" ? "Thực hành với các bài tập flashcards và quizzes." : "Practice with flashcards and quizzes exercises."}</p>
        </header>
        <Link href={localizedPath(locale, "/learn")} className="primary-action-v2">{locale === "vi" ? "Đến Learning Center →" : "Go to Learning Center →"}</Link>
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
