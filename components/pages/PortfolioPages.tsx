import { LearnExplorerV2 } from "@/components/learn/LearnExplorerV2";
import { ProjectsBrowserV2 } from "@/components/projects/ProjectsBrowserV2";
import { SystemExplorerV2 } from "@/components/trace/SystemExplorerV2";
import { projects } from "@/lib/content";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";
import { config, getOwnerName, getUtilityLinks, isRealUrl } from "@/lib/site";

export function ProjectsPageV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return <div className="v2-page page-shell-v2 index-page-v2"><header className="index-cover-v2"><p className="eyebrow-v2">{dict.projects.eyebrow}</p><h1>{dict.projects.title}</h1><p>{dict.projects.subtitle}</p></header><ProjectsBrowserV2 locale={locale} /></div>;
}

export function SystemPageV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div className="v2-page system-page-v2">
      <header className="page-shell-v2 system-cover-v2"><p className="eyebrow-v2">{dict.system.eyebrow}</p><h1>{dict.system.title}</h1><p>{dict.system.subtitle}</p></header>
      <section className="page-shell-v2"><SystemExplorerV2 locale={locale} /></section>
      <section className="system-principles-v2 page-shell-v2">
        <article><span className="mono">01</span><h2>{locale === "vi" ? "Routing phải giải thích được" : "Routing must be explainable"}</h2><p>{locale === "vi" ? "Capability được chọn cùng lý do, contract và fallback — không chỉ đổi màu node." : "A selected capability includes its reason, contract and fallback—not merely a colored node."}</p></article>
        <article><span className="mono">02</span><h2>{locale === "vi" ? "Mọi ranh giới đều có contract" : "Every boundary has a contract"}</h2><p>{locale === "vi" ? "Agent Card, tool/data input và artifact output đều hiện rõ." : "Agent Cards, tool/data inputs and artifact outputs remain visible."}</p></article>
        <article><span className="mono">03</span><h2>{locale === "vi" ? "Mô phỏng không giả làm live" : "Simulation never pretends to be live"}</h2><p>{getDictionary(locale).common.simulation}</p></article>
      </section>
    </div>
  );
}

export function LearnPageV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return <div className="v2-page page-shell-v2 learn-page-v2"><header className="index-cover-v2"><p className="eyebrow-v2">{dict.learn.eyebrow}</p><h1>{dict.learn.title}</h1><p>{dict.learn.subtitle}</p></header><LearnExplorerV2 locale={locale} /></div>;
}

export function EvidencePageV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const rows = [
    [dict.evidence.labels.documented, locale === "vi" ? "Project narrative, architecture, flow, quyết định, giới hạn và roadmap từ package." : "Project narratives, architecture, flows, decisions, limitations and roadmaps from the supplied package.", "documented"],
    [dict.evidence.labels.located, locale === "vi" ? "Source website hiện tại và implementation V2 trong workspace này." : "Current website source and the V2 implementation in this workspace.", "located"],
    [dict.evidence.labels.verified, locale === "vi" ? "Chỉ được gắn sau khi build, test và browser check thực sự chạy." : "Applied only after production build, tests and browser checks actually run.", "verified"],
    [dict.evidence.labels.proposed, locale === "vi" ? "Auth, health registry, timeout/retry, circuit breaker, durable state và evaluation." : "Authentication, health registry, timeout/retry, circuit breaker, durable state and evaluation.", "proposed"],
    [dict.evidence.labels.pending, locale === "vi" ? "Project repository, commit, source excerpt, screenshot sản phẩm thật và owner profile." : "Project repositories, commits, verified excerpts, real product screenshots and owner profile.", "pending"]
  ];
  return (
    <div className="v2-page page-shell-v2 evidence-page-v2">
      <header className="index-cover-v2"><p className="eyebrow-v2">{dict.evidence.eyebrow}</p><h1>{dict.evidence.title}</h1><p>{dict.evidence.subtitle}</p></header>
      <section className="evidence-matrix-v2"><h2>{dict.evidence.matrix}</h2>{rows.map(([label, copy, state]) => <article className={`evidence-${state}`} key={label}><span>{label}</span><p>{copy}</p></article>)}</section>
      <section className="evidence-details-v2">
        <article><h2>{dict.evidence.limitations}</h2><ul><li>{locale === "vi" ? "Không có live AI backend." : "No live AI backend."}</li><li>{locale === "vi" ? "Không có owner data đã xác minh." : "No verified owner data."}</li><li>{locale === "vi" ? "Không có repo/commit của sáu project trong config." : "No repository/commit for the six projects in config."}</li><li>{locale === "vi" ? "Trace, lab và artifact là mô phỏng deterministic phía client." : "Traces, labs and artifacts are deterministic client-side simulations."}</li></ul></article>
        <article><h2>{dict.evidence.hardening}</h2><ol><li>Authentication & authorization</li><li>Durable state & idempotency</li><li>Timeout · retry · circuit breaker</li><li>Cross-service tracing</li><li>Evaluation & provenance</li></ol></article>
        <article><h2>{dict.evidence.privacy}</h2><p>{locale === "vi" ? "Website không gửi prompt lab, file hoặc progress lên server. Voice dùng Web Speech API của trình duyệt sau thao tác người dùng; hành vi voice phụ thuộc thiết bị." : "The site does not submit lab prompts, files or progress to a server. Voice uses the browser Web Speech API after user action; device behavior varies."}</p></article>
      </section>
    </div>
  );
}

export function AboutPageV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div className="v2-page page-shell-v2 about-page-v2">
      <header className="index-cover-v2"><p className="eyebrow-v2">{dict.about.eyebrow}</p><h1>{dict.about.title}</h1><p>{dict.about.body}</p></header>
      <section className="about-ladder-v2"><h2>{dict.about.explored}</h2><ol>{projects.map((project) => <li key={project.slug}><span className="mono">{String(project.index).padStart(2, "0")}</span><strong>{project.verb}</strong><p>{project.lesson}</p></li>)}</ol></section>
      <section className="capability-ledger-v2"><h2>{dict.about.capabilities}</h2><p>Google ADK · Python · tool calling · session state · role transfer · AgentTool · SequentialAgent · ParallelAgent · LoopAgent · MCP · RAG · A2A</p></section>
    </div>
  );
}

export function ContactPageV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const email = isRealUrl(config.owner.email) ? config.owner.email : null;
  const owner = getOwnerName();
  const emailDisplay = email ? email.replace("mailto:", "") : null;

  const links: { label: string; href: string; display: string }[] = [];
  if (email) links.push({ label: locale === "vi" ? "Email" : "Email", href: email, display: emailDisplay! });
  if (isRealUrl(config.owner.githubProfile)) links.push({ label: "GitHub", href: config.owner.githubProfile!, display: config.owner.githubProfile!.replace("https://", "") });
  if (isRealUrl(config.owner.linkedin)) links.push({ label: "LinkedIn", href: config.owner.linkedin!, display: config.owner.linkedin!.replace("https://www.", "").replace("https://", "") });
  if (isRealUrl(config.owner.cvUrl)) links.push({ label: "CV / Résumé", href: config.owner.cvUrl!, display: locale === "vi" ? "Xem CV" : "View CV" });

  return (
    <div className="v2-page contact-links-page">
      <p className="eyebrow-v2">{dict.contact.eyebrow}</p>
      <h1>{dict.contact.title}</h1>
      <p className="contact-lede">{dict.contact.body}</p>
      {owner && <p className="contact-lede" style={{ marginTop: "-2rem" }}>{owner}</p>}
      {links.length > 0 ? (
        <ul className="contact-links-list" aria-label={locale === "vi" ? "Liên kết liên hệ" : "Contact links"}>
          {links.map((link) => (
            <li key={link.label} className="contact-link-item">
              <span className="contact-link-label">{link.label}</span>
              <a href={link.href} target={link.href.startsWith("mailto") ? undefined : "_blank"} rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}>
                {link.display}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "var(--text-low)" }}>{dict.common.noContact}</p>
      )}
      <div style={{ marginTop: "3rem", borderTop: "1px solid var(--border-hairline)", paddingTop: "2rem" }}>
        <a href={localizedPath(locale, "/projects")} style={{ color: "var(--accent-cyan)", textDecoration: "none" }}>{dict.nav.projects} →</a>
      </div>
    </div>
  );
}

