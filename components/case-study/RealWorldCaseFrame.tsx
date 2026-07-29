import { getRealWorldCase } from "@/content/real-world-cases";
import type { Locale } from "@/lib/i18n";

const chipMarks = {
  person: "◎",
  time: "◷",
  budget: "₫",
  target: "⌖",
  data: "▦",
  risk: "!",
} as const;

export function RealWorldCaseFrame({ slug, locale }: { slug: string; locale: Locale }) {
  const item = getRealWorldCase(slug, locale);
  if (!item) return null;
  const vi = locale === "vi";
  const artifact = item.expectedArtifacts[0];

  return (
    <section className={`real-world-case motif-${item.visualMotif}`} aria-labelledby={`${item.id}-title`}>
      <div className="case-scene-column">
        <div className="case-scene" aria-hidden="true">
          <span className="scene-grid" />
          <span className="scene-line scene-line-a" />
          <span className="scene-line scene-line-b" />
          <span className="scene-node scene-node-a" />
          <span className="scene-node scene-node-b" />
          <span className="scene-node scene-node-c" />
          <span className="scene-object scene-object-a" />
          <span className="scene-object scene-object-b" />
          <span className="scene-object scene-object-c" />
          <b>{item.caseLabel.split("·")[0].trim()}</b>
        </div>

        <dl className={`case-artifact-preview artifact-${artifact.type}`}>
          <div className="artifact-heading">
            <dt>{vi ? "OUTPUT CẦN NHẬN" : "EXPECTED OUTPUT"}</dt>
            <dd>{artifact.title}</dd>
          </div>
          {artifact.previewData.map((row) => (
            <div key={`${row.label}-${row.value}`}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="case-story-column">
        <header>
          <p className="case-label">{item.caseLabel}</p>
          <h2 id={`${item.id}-title`}>{item.headline}</h2>
          <p className="case-persona">
            <strong>{item.persona.role}</strong>
            <span>{item.persona.context}</span>
          </p>
        </header>

        <ul className="case-context-chips" aria-label={vi ? "Bối cảnh case" : "Case context"}>
          {item.contextChips.map((chip) => (
            <li key={`${chip.label}-${chip.value}`}>
              <span aria-hidden="true">{chipMarks[chip.icon]}</span>
              <small>{chip.label}</small>
              <strong>{chip.value}</strong>
            </li>
          ))}
        </ul>

        <p className="case-story">{item.story}</p>

        <div className="case-brief-columns">
          <section>
            <h3>{vi ? "Vấn đề chính" : "Main problems"}</h3>
            <ul>{item.pains.map((pain) => <li key={pain}>{pain}</li>)}</ul>
          </section>
          <section>
            <h3>{vi ? "Ràng buộc" : "Constraints"}</h3>
            <ul>{item.constraints.map((constraint) => <li key={constraint}><span aria-hidden="true">—</span>{constraint}</li>)}</ul>
          </section>
        </div>

        <p className="case-added-capability">{item.addedCapability}</p>
        <a
          className="case-simulator-cta"
          href={`?scenario=${item.simulatorCaseId}#${slug}-simulator`}
        >
          {vi ? "Xem agent xử lý case này" : "Watch the agent handle this case"}
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
