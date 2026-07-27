import { getProjectReplays } from "@/lib/replays";
import type { Locale } from "@/lib/i18n";

export function StaticReplayFallback({ slug, locale }: { slug: string; locale: Locale }) {
  const replay = getProjectReplays(slug)[0];
  if (!replay) return null;
  return (
    <section className={`verified-replay verified-replay-static project-${slug}`} aria-label={replay.title}>
      <header className="replay-head">
        <div><span className="mono">{replay.mode.replaceAll("-", " ")}</span><h3>{replay.title}</h3><p>{replay.description}</p></div>
        <span className={`replay-mode mode-${replay.mode}`}>{replay.mode.replaceAll("-", " ")}</span>
      </header>
      <p className="replay-trust-notice">{locale === "vi" ? "Bản phát lại tĩnh — không phải request đang chạy trực tiếp." : "Static replay — not a request running live."}</p>
      <ol className="replay-event-list">
        {replay.events.map((event) => <li key={event.sequence}><span className="event-sequence mono">{String(event.sequence).padStart(2, "0")}</span><span><strong>{event.type.replaceAll("_", " ")}</strong><small>{event.actor}</small></span></li>)}
      </ol>
      <details><summary>{locale === "vi" ? "Đọc input và output" : "Read input and output"}</summary><pre><code>{JSON.stringify({ input: replay.input, output: replay.output }, null, 2)}</code></pre></details>
    </section>
  );
}
