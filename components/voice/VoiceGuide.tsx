"use client";

import { useEffect, useMemo, useState } from "react";

import type { VoiceSection } from "@/content/voice";
import { getDictionary, type Locale } from "@/lib/i18n";

type VoiceStatus = "idle" | "speaking" | "paused";

export function VoiceGuide({
  locale,
  sections,
  compact = false
}: {
  locale: Locale;
  sections: VoiceSection[];
  compact?: boolean;
}) {
  const dict = getDictionary(locale);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [rate, setRate] = useState(1);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [sectionIndex, setSectionIndex] = useState(0);
  const language = locale === "vi" ? "vi-VN" : "en-US";
  const current = sections[sectionIndex];
  const matchingVoices = useMemo(
    () => voices.filter((voice) => voice.lang.toLowerCase().startsWith(locale)),
    [locale, voices]
  );

  useEffect(() => {
    const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setSupported(canSpeak);
    if (!canSpeak) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    const onCommand = (event: Event) => {
      const action = (event as CustomEvent<{ action: "play" | "stop" }>).detail?.action;
      if (action === "stop") stop();
      if (action === "play") speak();
    };
    window.addEventListener("adk:voice", onCommand);
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.removeEventListener("adk:voice", onCommand);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!matchingVoices.length) {
      setVoiceUri("");
      return;
    }
    if (!matchingVoices.some((voice) => voice.voiceURI === voiceUri)) {
      setVoiceUri(matchingVoices[0].voiceURI);
    }
  }, [matchingVoices, voiceUri]);

  if (!sections.length) return null;

  function speak() {
    if (!supported || !current) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(current.text);
    utterance.lang = language;
    utterance.rate = rate;
    const selected = matchingVoices.find((voice) => voice.voiceURI === voiceUri);
    if (selected) utterance.voice = selected;
    utterance.addEventListener("start", () => setStatus("speaking"));
    utterance.addEventListener("pause", () => setStatus("paused"));
    utterance.addEventListener("resume", () => setStatus("speaking"));
    utterance.addEventListener("end", () => setStatus("idle"));
    utterance.addEventListener("error", () => setStatus("idle"));
    window.speechSynthesis.speak(utterance);
  }

  function pauseResume() {
    if (!supported) return;
    if (status === "speaking") {
      window.speechSynthesis.pause();
      setStatus("paused");
    } else if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("speaking");
    }
  }

  function stop() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setStatus("idle");
  }

  function changeSection(next: number) {
    stop();
    setSectionIndex(Math.max(0, Math.min(sections.length - 1, next)));
  }

  if (supported === false) {
    return (
      <aside className="voice-guide voice-unsupported" aria-label={dict.voice.title}>
        <strong>{dict.voice.title}</strong>
        <p>{dict.voice.unsupported}</p>
      </aside>
    );
  }

  return (
    <aside className={`voice-guide ${compact ? "voice-guide-compact" : ""}`} aria-label={dict.voice.title}>
      <div className="voice-heading">
        <div>
          <span className="mono">{dict.voice.title}</span>
          <strong>{current.label}</strong>
        </div>
        <span className="voice-status mono" data-status={status} aria-live="polite">
          {status}
        </span>
      </div>

      <p className="voice-transcript">{current.text}</p>

      <div className="voice-transport" role="group" aria-label={dict.voice.title}>
        <button type="button" onClick={() => changeSection(sectionIndex - 1)} disabled={sectionIndex === 0}>
          {dict.voice.previous}
        </button>
        <button type="button" onClick={speak} disabled={!supported}>{dict.voice.play}</button>
        <button type="button" onClick={pauseResume} disabled={status === "idle"}>
          {status === "paused" ? dict.voice.resume : dict.voice.pause}
        </button>
        <button type="button" onClick={stop} disabled={status === "idle"}>{dict.voice.stop}</button>
        <button type="button" onClick={() => changeSection(sectionIndex + 1)} disabled={sectionIndex === sections.length - 1}>
          {dict.voice.next}
        </button>
      </div>

      {!compact ? (
        <div className="voice-settings">
          <label>
            <span>{dict.voice.section}</span>
            <select name="voice-section" value={sectionIndex} onChange={(event) => changeSection(Number(event.target.value))}>
              {sections.map((section, index) => <option value={index} key={section.id}>{section.label}</option>)}
            </select>
          </label>
          <label>
            <span>{dict.voice.speed}</span>
            <select name="voice-rate" value={rate} onChange={(event) => { stop(); setRate(Number(event.target.value)); }}>
              <option value={0.8}>0.8×</option>
              <option value={1}>1.0×</option>
              <option value={1.2}>1.2×</option>
            </select>
          </label>
          {matchingVoices.length > 1 ? (
            <label>
              <span>{dict.voice.voice}</span>
              <select name="voice-device" value={voiceUri} onChange={(event) => { stop(); setVoiceUri(event.target.value); }}>
                {matchingVoices.map((voice) => <option value={voice.voiceURI} key={voice.voiceURI}>{voice.name}</option>)}
              </select>
            </label>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
