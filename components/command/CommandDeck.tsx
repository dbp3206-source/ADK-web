"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { projects } from "@/lib/content";
import { getDictionary, localeFromPath, localizedPath } from "@/lib/i18n";

type Command = { id: string; label: string; hint: string; run: () => void };

export function CommandDeck() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const dict = getDictionary(locale);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const navigate = (path: string) => window.location.assign(localizedPath(locale, path));

  const commands = useMemo<Command[]>(() => [
    { id: "home", label: dict.nav.home, hint: "G H", run: () => navigate("/") },
    { id: "projects", label: dict.nav.projects, hint: "G P", run: () => navigate("/projects") },
    { id: "system", label: dict.nav.system, hint: "G S", run: () => navigate("/system") },
    { id: "learn", label: dict.nav.learn, hint: "G L", run: () => navigate("/learn") },
    { id: "flashcards", label: locale === "vi" ? "Mở 60 flashcards" : "Open 60 flashcards", hint: "F", run: () => navigate("/learn/flashcards") },
    { id: "question-bank", label: locale === "vi" ? "Mở ngân hàng 90 câu hỏi" : "Open 90-question bank", hint: "Q", run: () => navigate("/learn/question-bank") },
    { id: "contact", label: dict.nav.contact, hint: "G C", run: () => navigate("/contact") },
    { id: "trace", label: dict.command.startTrace, hint: "↵", run: () => window.location.assign(`${localizedPath(locale, "/system")}?preset=dashboard-drop`) },
    { id: "voice-start", label: locale === "vi" ? "Bắt đầu thuyết minh" : "Start voice narration", hint: "V", run: () => window.dispatchEvent(new CustomEvent("adk:voice", { detail: { action: "play" } })) },
    { id: "voice-stop", label: locale === "vi" ? "Dừng thuyết minh" : "Stop voice narration", hint: "⇧V", run: () => window.dispatchEvent(new CustomEvent("adk:voice", { detail: { action: "stop" } })) },
    {
      id: "locale",
      label: locale === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt",
      hint: locale === "vi" ? "EN" : "VI",
      run: () => window.location.assign(localizedPath(locale === "vi" ? "en" : "vi", pathname.replace(/^\/(vi|en)/, "") || "/"))
    },
    {
      id: "reset",
      label: dict.command.resetProgress,
      hint: "R",
      run: () => {
        window.localStorage.removeItem("adk-v2-journey-progress");
        window.localStorage.removeItem("adk-v2-journey-mode");
        window.localStorage.removeItem("adk-learning-v22");
        window.dispatchEvent(new CustomEvent("adk:journey-reset"));
      }
    },
    ...projects.map((project) => ({
      id: project.slug,
      label: `${dict.common.openProject}: ${project.title}`,
      hint: String(project.index).padStart(2, "0"),
      run: () => navigate(`/projects/${project.slug}`)
    }))
  ], [dict, locale, pathname]);

  const matches = commands.filter((command) =>
    `${command.label} ${command.id}`.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale))
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        triggerRef.current = document.activeElement as HTMLElement;
        setOpen((current) => !current);
      }
    };
    const onOpen = () => {
      triggerRef.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("adk:command-open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("adk:command-open", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = dialogRef.current?.querySelectorAll<HTMLElement>('input, button:not([disabled]), a[href]');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
      triggerRef.current?.focus();
    };
  }, [open]);

  function execute(command: Command) {
    setOpen(false);
    setQuery("");
    command.run();
  }

  if (!open) return null;
  return (
    <div className="command-backdrop" onMouseDown={() => setOpen(false)}>
      <div className="command-deck" role="dialog" aria-modal="true" aria-labelledby="command-title" ref={dialogRef} onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div><span className="eyebrow-v2">CTRL / CMD + K</span><h2 id="command-title">{dict.command.title}</h2></div>
          <button type="button" onClick={() => setOpen(false)} aria-label={dict.common.close}>×</button>
        </header>
        <label className="command-search">
          <span className="sr-only">{dict.command.search}</span>
          <input ref={inputRef} name="command-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={dict.command.search} />
        </label>
        <div className="command-results" aria-live="polite">
          {matches.length ? <ul>{matches.map((command) => (
            <li key={command.id}><button type="button" onClick={() => execute(command)}><span>{command.label}</span><kbd>{command.hint}</kbd></button></li>
          ))}</ul> : <p>{dict.command.empty}</p>}
        </div>
      </div>
    </div>
  );
}
