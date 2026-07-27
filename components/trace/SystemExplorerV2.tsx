"use client";

import { useEffect, useMemo, useState } from "react";

import { getTracePresets } from "@/content/trace-presets-v2";
import { getVoiceSections } from "@/content/voice";
import { VoiceGuide } from "@/components/voice/VoiceGuide";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";

const services = [
  ["trip-planner", "Trip Planner", ":8001"],
  ["script-team", "Script Team", ":8002"],
  ["worldcup-analyst", "World Cup Analyst", ":8003"],
  ["love-advisor", "Love Advisor", ":8004"],
  ["dashboard-insights", "Dashboard Insights", ":8005"]
] as const;

export function SystemExplorerV2({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const dict = getDictionary(locale);
  const presets = useMemo(() => getTracePresets(locale), [locale]);
  const [presetId, setPresetId] = useState(presets[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const preset = presets.find((item) => item.id === presetId) ?? presets[0];
  const step = preset.steps[stepIndex];
  const complete = stepIndex === preset.steps.length - 1;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedPreset = params.get("preset");
    const requestedStep = Number(params.get("step"));
    if (requestedPreset && presets.some((item) => item.id === requestedPreset)) setPresetId(requestedPreset);
    if (Number.isInteger(requestedStep) && requestedStep >= 1 && requestedStep <= 7) setStepIndex(requestedStep - 1);
    if (params.get("autoplay") === "1") setPlaying(true);
  }, [presets]);

  useEffect(() => {
    if (!playing) return;
    if (complete) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStepIndex((current) => current + 1), 1100);
    return () => window.clearTimeout(timer);
  }, [complete, playing, stepIndex]);

  useEffect(() => {
    if (compact) return;
    const params = new URLSearchParams(window.location.search);
    params.set("preset", preset.id);
    params.set("step", String(stepIndex + 1));
    params.delete("autoplay");
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`);
  }, [compact, preset.id, stepIndex]);

  function selectPreset(id: string) {
    setPresetId(id);
    setStepIndex(0);
    setPlaying(false);
  }

  async function copyDeepLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className={`system-explorer-v2 ${compact ? "system-explorer-compact" : ""}`} aria-label={dict.system.title}>
      <p className="simulation-banner" role="note">
        <span aria-hidden="true">◇</span>
        <strong>{dict.common.simulation}</strong>
      </p>

      <div className="explorer-toolbar">
        <label className="preset-control">
          <span>{dict.system.preset}</span>
          <select name="trace-preset" value={preset.id} onChange={(event) => selectPreset(event.target.value)}>
            {presets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <div className="explorer-controls" role="group" aria-label={dict.system.stepList}>
          <button type="button" aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>
            {playing ? dict.system.pause : dict.system.play}
          </button>
          <button type="button" disabled={stepIndex === 0} onClick={() => { setPlaying(false); setStepIndex((value) => Math.max(0, value - 1)); }}>
            {dict.system.previous}
          </button>
          <button type="button" disabled={complete} onClick={() => { setPlaying(false); setStepIndex((value) => Math.min(6, value + 1)); }}>
            {dict.system.next}
          </button>
          <button type="button" onClick={() => { setPlaying(false); setStepIndex(0); }}>{dict.system.restart}</button>
        </div>
        <span className="explorer-counter mono">{dict.system.step} {stepIndex + 1}/7</span>
      </div>

      <div className="explorer-stage">
        <div className="topology-v2" aria-label={`A2A topology: ${preset.label}`}>
          <div className={`topology-v2-node type-input ${stepIndex === 0 ? "is-active" : stepIndex > 0 ? "is-visited" : ""}`}>
            <span aria-hidden="true">◎</span><small>input</small><strong>User request</strong>
          </div>
          <span className={`signal-edge ${stepIndex >= 1 ? "is-active" : ""}`} aria-hidden="true">→</span>
          <div className={`topology-v2-node type-remote ${stepIndex === 1 ? "is-active" : stepIndex > 1 ? "is-visited" : ""}`}>
            <span aria-hidden="true">▣</span><small>remote service</small><strong>Orchestrator :8000</strong>
          </div>
          <span className={`signal-edge ${stepIndex >= 2 ? "is-active" : ""}`} aria-hidden="true">→</span>
          <div className="specialist-topology">
            {services.map(([slug, label, port]) => {
              const selected = preset.targetProject === slug;
              return (
                <div
                  className={`topology-v2-node type-agent ${selected && stepIndex >= 2 ? "is-active" : ""} ${!selected ? "is-muted" : ""}`}
                  key={slug}
                >
                  <span aria-hidden="true">⬡</span><small>agent</small><strong>{label} {port}</strong>
                </div>
              );
            })}
          </div>
          <span className={`signal-edge ${stepIndex >= 6 ? "is-active" : ""}`} aria-hidden="true">→</span>
          <div className={`topology-v2-node type-artifact ${stepIndex === 6 ? "is-active" : ""}`}>
            <span aria-hidden="true">▱</span><small>artifact</small><strong>Return</strong>
          </div>
        </div>

        <aside className="trace-inspector-v2" aria-label={`${dict.system.step} ${stepIndex + 1}`}>
          <div className="inspector-kicker">
            <span className="mono">{step.stage}</span>
            <span className="mono">{playing ? "PLAYING" : complete ? "COMPLETE" : "PAUSED"}</span>
          </div>
          <h2>{step.title}</h2>
          <p>{step.detail}</p>

          <dl className="contract-inspector">
            <div className={step.stage === "route" ? "is-current" : ""}><dt>{dict.system.routing}</dt><dd>{preset.routingReason}</dd></div>
            <div className={step.stage === "contract" ? "is-current" : ""}><dt>{dict.system.card}</dt><dd><span>Name: {preset.targetProject}</span><span>Endpoint: {preset.port}</span><span>Capability: {preset.capability}</span><span>Input: {preset.inputContract}</span><span>Output: {preset.outputContract}</span></dd></div>
            <div className={step.stage === "workflow" ? "is-current" : ""}><dt>{dict.system.workflow}</dt><dd>{preset.workflow.join(" → ")}</dd></div>
            <div className={step.stage === "tool" ? "is-current" : ""}><dt>{dict.system.contract}</dt><dd>{preset.toolContract}</dd></div>
            <div className={step.stage === "validation" ? "is-current" : ""}><dt>{dict.system.validation}</dt><dd>{preset.validation}</dd></div>
            <div className={step.stage === "artifact" ? "is-current" : ""}><dt>{dict.system.artifact}</dt><dd>{preset.artifact}<br />{preset.fallback}</dd></div>
          </dl>

          <div className="inspector-actions">
            <a href={localizedPath(locale, `/projects/${preset.targetProject}#lab`)}>{dict.common.openProject}</a>
            {!compact ? <button type="button" onClick={copyDeepLink}>{copied ? dict.common.copied : dict.system.deepLink}</button> : null}
          </div>
        </aside>
      </div>

      {!compact ? (
        <>
          <ol className="trace-step-list" aria-label={dict.system.stepList}>
            {preset.steps.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={index === stepIndex ? "step" : undefined}
                  onClick={() => { setPlaying(false); setStepIndex(index); }}
                >
                  <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                  <span>{item.title}</span>
                </button>
              </li>
            ))}
          </ol>
          <details className="trace-text-v2">
            <summary>{dict.common.readAsText}</summary>
            <ol>{preset.steps.map((item) => <li key={item.id}><strong>{item.title}.</strong> {item.detail}</li>)}</ol>
          </details>
          <VoiceGuide locale={locale} sections={getVoiceSections("system", locale)} />
        </>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {dict.system.step} {stepIndex + 1}/7. {step.title}. {step.detail}
      </p>
    </section>
  );
}
