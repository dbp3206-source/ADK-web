"use client";

import { useEffect, useMemo, useState } from "react";

import { getProjectReplays, type ReplayCase } from "@/lib/replays";
import type { Locale } from "@/lib/i18n";

const PLAYBACK_MS = 1100;

function formatVerifiedAt(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

const copy = {
  vi: {
    notice: "Bản phát lại đã kiểm chứng — không phải request đang chạy trực tiếp.",
    simulation: "Mô phỏng trên trình duyệt — không phải model hoặc backend đang chạy.",
    case: "Ca kiểm thử",
    input: "Đầu vào đã ghi nhận",
    play: "Phát",
    pause: "Tạm dừng",
    previous: "Trước",
    next: "Sau",
    restart: "Chạy lại",
    step: "Bước",
    event: "Sự kiện quan sát được",
    details: "Chi tiết đã làm sạch",
    state: "Thay đổi trạng thái",
    output: "Kết quả thực tế",
    expected: "Kỳ vọng và assertions",
    source: "Nguồn kiểm chứng",
    raw: "JSON sự kiện đã làm sạch",
    copyLink: "Sao chép liên kết",
    copied: "Đã sao chép",
    noCases: "Chưa có ca phát lại cho project này.",
    mode: {
      "verified-local-replay": "Verified Local Replay",
      "verified-mocked-replay": "Verified Replay with Mocked Dependency",
      "browser-simulation": "Browser Simulation",
      "live-execution": "Live Execution",
    },
  },
  en: {
    notice: "Verified replay — not a request running live.",
    simulation: "Browser simulation — no model or backend is running.",
    case: "Test case",
    input: "Recorded input",
    play: "Play",
    pause: "Pause",
    previous: "Previous",
    next: "Next",
    restart: "Restart",
    step: "Step",
    event: "Observable event",
    details: "Sanitized details",
    state: "State change",
    output: "Actual output",
    expected: "Expected result and assertions",
    source: "Verification source",
    raw: "Raw sanitized event JSON",
    copyLink: "Copy deep link",
    copied: "Copied",
    noCases: "No replay case is available for this project.",
    mode: {
      "verified-local-replay": "Verified Local Replay",
      "verified-mocked-replay": "Verified Replay with Mocked Dependency",
      "browser-simulation": "Browser Simulation",
      "live-execution": "Live Execution",
    },
  },
} as const;

function JsonBlock({ value }: { value: unknown }) {
  return <pre tabIndex={0}><code>{JSON.stringify(value, null, 2)}</code></pre>;
}

function ReplayArtifact({ replay }: { replay: ReplayCase }) {
  const output = replay.output && typeof replay.output === "object" ? replay.output as Record<string, unknown> : {};
  const relevantEvents = replay.events.filter((event) => ["routing", "handoff", "calculation", "qa_check", "revision", "fallback", "artifact_created"].includes(event.type));
  if (replay.project === "trip-planner") {
    const state = output.retrievedState && typeof output.retrievedState === "object" ? output.retrievedState as Record<string, unknown> : {};
    return (
      <div className="artifact-renderer trip-artifact-renderer">
        <strong>Session state</strong>
        {Object.keys(state).length ? <dl>{Object.entries(state).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>)}</dl> : <p className="artifact-empty">not-found · no stored trip state</p>}
        {replay.events.some((event) => event.type === "state_write") ? <span className="artifact-receipt">state_write observed</span> : null}
      </div>
    );
  }
  if (replay.project === "script-team") {
    return (
      <div className="artifact-renderer script-artifact-renderer">
        <strong>Handoff record</strong>
        <ol>{relevantEvents.map((event) => <li key={event.sequence}><span>{event.actor}</span><p>{event.summary}</p></li>)}</ol>
        {"feedback" in output ? <JsonBlock value={output.feedback} /> : null}
        {"revision" in output ? <div className="artifact-paper"><b>Revision</b><p>{String(output.revision)}</p></div> : <p className="artifact-empty">No revision artifact was created.</p>}
      </div>
    );
  }
  if (replay.project === "worldcup-analyst") {
    return (
      <div className="artifact-renderer worldcup-artifact-renderer">
        <article><strong>Evidence scope</strong><JsonBlock value={output.searchResult ?? output.analystReport ?? null} /></article>
        <article><strong>Calculation tape</strong><JsonBlock value={output.calculationTape ?? relevantEvents.filter((event) => event.type === "calculation")} /></article>
      </div>
    );
  }
  if (replay.project === "love-advisor") {
    const branchEvents = replay.events.filter((event) => event.type === "agent_started" || event.type === "completed");
    return (
      <div className="artifact-renderer love-artifact-renderer">
        <div><strong>Lens A</strong><p>{branchEvents[0]?.summary ?? "Waiting for branch event."}</p></div>
        <div><strong>Synthesis gate</strong><p>{replay.events.find((event) => event.type === "validation")?.summary ?? "Validation event not captured."}</p></div>
        <div><strong>Lens B</strong><p>{branchEvents[1]?.summary ?? "Waiting for branch event."}</p></div>
        <JsonBlock value={output} />
      </div>
    );
  }
  if (replay.project === "dashboard-insights") {
    return (
      <div className="artifact-renderer dashboard-artifact-renderer">
        <aside><strong>Ingestion & QA</strong>{relevantEvents.map((event) => <p key={event.sequence}><span>{event.type}</span>{event.summary}</p>)}</aside>
        <article><strong>Report artifact</strong><JsonBlock value={output.finalDashboardReport ?? output} /></article>
      </div>
    );
  }
  return (
    <div className="artifact-renderer a2a-artifact-renderer">
      <div className="a2a-signal-path">{relevantEvents.map((event) => <span key={event.sequence}>{event.type.replaceAll("_", " ")} · {event.actor}</span>)}</div>
      <article><strong>Routing artifact / fallback</strong><JsonBlock value={output} /></article>
    </div>
  );
}

export function VerifiedReplayPlayer({
  slug,
  locale,
  compact = false,
}: {
  slug: string;
  locale: Locale;
  compact?: boolean;
}) {
  const cases = useMemo(() => getProjectReplays(slug), [slug]);
  const labels = copy[locale];
  const [caseIndex, setCaseIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [copied, setCopied] = useState(false);
  const activeCase = cases[caseIndex];
  const activeEvent = activeCase?.events[stepIndex];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCase = params.get("case");
    const requestedEvent = Number(params.get("event"));
    const nextCaseIndex = cases.findIndex((item) => item.caseId === requestedCase);
    const safeCaseIndex = nextCaseIndex >= 0 ? nextCaseIndex : 0;
    const eventCount = cases[safeCaseIndex]?.events.length ?? 1;
    setCaseIndex(safeCaseIndex);
    if (Number.isFinite(requestedEvent) && requestedEvent > 0) {
      setStepIndex(Math.min(eventCount - 1, Math.max(0, requestedEvent - 1)));
    }
  }, [cases]);

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [caseIndex]);

  useEffect(() => {
    if (!playing || !activeCase) return;
    if (stepIndex >= activeCase.events.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(
      () => setStepIndex((current) => Math.min(current + 1, activeCase.events.length - 1)),
      PLAYBACK_MS / speed,
    );
    return () => window.clearTimeout(timer);
  }, [activeCase, playing, speed, stepIndex]);

  if (!activeCase) {
    return <div className="replay-empty" role="status">{labels.noCases}</div>;
  }


  function copyDeepLink() {
    const url = new URL(window.location.href);
    url.hash = "replay";
    url.searchParams.set("case", activeCase.caseId);
    url.searchParams.set("event", String(stepIndex + 1));
    navigator.clipboard?.writeText(url.toString()).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  function togglePlayback() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (stepIndex >= activeCase.events.length - 1) setStepIndex(0);
    setPlaying(true);
  }

  return (
    <section className={`verified-replay project-${slug} ${compact ? "verified-replay-compact" : ""}`} id={`${slug}-replay-player`} aria-labelledby={`${slug}-replay-title`}>
      <header className="replay-head">
        <div>
          <span className="mono">{labels.mode[activeCase.mode]}</span>
          <h3 id={`${slug}-replay-title`}>{activeCase.title}</h3>
          {activeCase.description ? <p>{activeCase.description}</p> : null}
        </div>
        <span className={`replay-mode mode-${activeCase.mode}`}>{labels.mode[activeCase.mode]}</span>
      </header>

      <p className="replay-trust-notice">
        {activeCase.mode === "browser-simulation" ? labels.simulation : labels.notice}
      </p>

      <div className="replay-toolbar">
        <label>
          <span>{labels.case}</span>
          <select name={`${slug}-replay-case`} value={caseIndex} onChange={(event) => setCaseIndex(Number(event.target.value))}>
            {cases.map((item, index) => <option value={index} key={item.caseId}>{item.caseId} · {item.title}</option>)}
          </select>
        </label>
        <div className="replay-controls" role="group" aria-label={locale === "vi" ? "Điều khiển phát lại" : "Replay controls"}>
          <button type="button" aria-label={locale === "vi" ? "Sự kiện replay trước" : "Previous replay event"} onClick={() => setStepIndex((value) => Math.max(0, value - 1))} disabled={stepIndex === 0}>{labels.previous}</button>
          <button type="button" onClick={togglePlayback}>{playing ? labels.pause : labels.play}</button>
          <button type="button" aria-label={locale === "vi" ? "Sự kiện replay tiếp theo" : "Next replay event"} onClick={() => setStepIndex((value) => Math.min(activeCase.events.length - 1, value + 1))} disabled={stepIndex === activeCase.events.length - 1}>{labels.next}</button>
          <button type="button" onClick={() => { setStepIndex(0); setPlaying(false); }}>{labels.restart}</button>
          <label className="replay-speed">
            <span className="sr-only">{locale === "vi" ? "Tốc độ" : "Speed"}</span>
            <select name={`${slug}-replay-speed`} value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>
              <option value={0.8}>0.8×</option>
              <option value={1}>1×</option>
              <option value={1.2}>1.2×</option>
            </select>
          </label>
        </div>
        <span className="replay-counter mono">{labels.step} {stepIndex + 1} / {activeCase.events.length}</span>
      </div>

      <div className="replay-stage">
        <ol className="replay-event-list" aria-label={locale === "vi" ? "Danh sách sự kiện" : "Event list"}>
          {activeCase.events.map((event, index) => (
            <li key={`${event.sequence}-${event.type}`} className={index < stepIndex ? "is-complete" : index === stepIndex ? "is-active" : ""}>
              <button type="button" onClick={() => { setStepIndex(index); setPlaying(false); }} aria-current={index === stepIndex ? "step" : undefined}>
                <span className="event-sequence mono">{String(event.sequence).padStart(2, "0")}</span>
                <span><strong>{event.type.replaceAll("_", " ")}</strong><small>{event.actor}</small></span>
              </button>
            </li>
          ))}
        </ol>

        <article className="replay-inspector" aria-live="polite">
          <span className="mono">{labels.event} · {activeEvent.type.replaceAll("_", " ")}</span>
          <h4>{activeEvent.actor}</h4>
          <p>{activeEvent.summary}</p>
          {activeEvent.details ? <div><strong>{labels.details}</strong><JsonBlock value={activeEvent.details} /></div> : null}
          {activeEvent.stateDiff ? <div><strong>{labels.state}</strong><JsonBlock value={activeEvent.stateDiff} /></div> : null}
        </article>
      </div>

      {!compact ? (
        <>
          <div className="replay-input-output">
            <article><h4>{labels.input}</h4><JsonBlock value={activeCase.input} /></article>
            <article><h4>{labels.output}</h4><ReplayArtifact replay={activeCase} /><details><summary>JSON</summary><JsonBlock value={activeCase.output} /></details></article>
            <article>
              <h4>{labels.expected}</h4>
              {activeCase.expected !== undefined ? <JsonBlock value={activeCase.expected} /> : null}
              <ul className="assertion-list">
                {activeCase.assertions.map((assertion) => (
                  <li key={assertion.name} data-pass={assertion.passed}>
                    <span aria-hidden="true">{assertion.passed ? "✓" : "×"}</span>
                    <span>{assertion.name}{assertion.details ? ` — ${assertion.details}` : ""}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="replay-metadata">
            <div>
              <h4>{labels.source}</h4>
              <dl>
                <div><dt>Source</dt><dd><code>{activeCase.source.agentPath}</code></dd></div>
                <div><dt>Test</dt><dd><code>{activeCase.source.testPath}</code></dd></div>
                {activeCase.sourceCommit ? <div><dt>Commit</dt><dd><code>{activeCase.sourceCommit}</code></dd></div> : null}
                {activeCase.verifiedAt ? <div><dt>Verified (UTC)</dt><dd>{formatVerifiedAt(activeCase.verifiedAt, locale)}</dd></div> : null}
              </dl>
              <button type="button" onClick={copyDeepLink}>{copied ? labels.copied : labels.copyLink}</button>
            </div>
            <details>
              <summary>{labels.raw}</summary>
              <JsonBlock value={activeEvent} />
            </details>
          </div>

        </>
      ) : null}
      <noscript>
        <h4>{labels.input}</h4>
        <pre>{JSON.stringify(activeCase.input, null, 2)}</pre>
        <h4>{labels.event}</h4>
        <ol>{activeCase.events.map((event) => <li key={event.sequence}>{event.actor}: {event.summary}</li>)}</ol>
        <h4>{labels.output}</h4>
        <pre>{JSON.stringify(activeCase.output, null, 2)}</pre>
      </noscript>
    </section>
  );
}
