"use client";

import { useEffect, useMemo, useState } from "react";

import { LearningIllustration } from "@/components/learn/LearningIllustration";
import { DragDropPractice } from "@/components/learn/DragDropPractice";
import { StaticLink as Link } from "@/components/layout/StaticLink";
import {
  examConfig,
  getFlashcards,
  getPracticeActivities,
  getQuestions,
  learningModules,
  moduleCopy,
} from "@/lib/learning";
import { localizedPath, type Locale } from "@/lib/i18n";

type Progress = {
  flashcards: Record<string, "know" | "unsure" | "again">;
  questions: Record<string, boolean>;
  practice: string[];
  exams: Array<{ date: string; score: number; total: number }>;
};

const emptyProgress: Progress = { flashcards: {}, questions: {}, practice: [], exams: [] };

function useLearningProgress() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("adk-learning-v22");
      if (saved) setProgress(JSON.parse(saved) as Progress);
    } catch {
      setProgress(emptyProgress);
    }
  }, []);
  function update(next: Progress) {
    setProgress(next);
    try { window.localStorage.setItem("adk-learning-v22", JSON.stringify(next)); } catch { /* local fallback stays in memory */ }
  }
  return [progress, update] as const;
}

const text = {
  vi: {
    title: "Học & Ôn kiến trúc agent",
    intro: "Sáu lộ trình nối trực tiếp từ khái niệm đến source, replay và quyết định kiến trúc trong portfolio.",
    paths: "Lộ trình",
    flashcards: "60 flashcards",
    questions: "90 câu hỏi",
    practice: "12 bài thực hành",
    exam: "Thi thử",
    open: "Mở",
    progress: "Tiến độ cục bộ",
    reset: "Đặt lại tiến độ",
    front: "Khái niệm",
    answer: "Giải thích",
    reveal: "Lật thẻ",
    previous: "Trước",
    next: "Tiếp",
    know: "Đã biết",
    unsure: "Chưa chắc",
    again: "Ôn lại",
    check: "Kiểm tra",
    explanation: "Giải thích",
    correct: "Đúng",
    incorrect: "Chưa đúng",
    complete: "Đánh dấu hoàn thành",
    completed: "Đã hoàn thành",
    start: "Bắt đầu đề",
    submit: "Nộp bài",
    score: "Điểm",
  },
  en: {
    title: "Learn and review agent architecture",
    intro: "Six learning paths connect concepts directly to source, replay evidence, and architecture decisions in the portfolio.",
    paths: "Paths",
    flashcards: "60 flashcards",
    questions: "90 questions",
    practice: "12 exercises",
    exam: "Mock exam",
    open: "Open",
    progress: "Local progress",
    reset: "Reset progress",
    front: "Concept",
    answer: "Explanation",
    reveal: "Flip card",
    previous: "Previous",
    next: "Next",
    know: "Know",
    unsure: "Unsure",
    again: "Review again",
    check: "Check answer",
    explanation: "Explanation",
    correct: "Correct",
    incorrect: "Not yet",
    complete: "Mark complete",
    completed: "Completed",
    start: "Start exam",
    submit: "Submit exam",
    score: "Score",
  },
} as const;

function LearningHeader({ locale, current }: { locale: Locale; current: string }) {
  const t = text[locale];
  const links = [
    [t.paths, "/learn/paths"],
    [t.flashcards, "/learn/flashcards"],
    [t.questions, "/learn/question-bank"],
    [t.practice, "/learn/practice"],
    [t.exam, "/learn/mock-exam"],
  ];
  return (
    <header className="learning-header page-shell-v2">
      <span className="eyebrow-v2">LEARNING CENTER</span>
      <h1>{t.title}</h1>
      <p>{t.intro}</p>
      <nav aria-label={locale === "vi" ? "Công cụ học tập" : "Learning tools"}>
        {links.map(([label, href]) => <Link key={href} href={localizedPath(locale, href)} aria-current={current === href ? "page" : undefined}>{label}</Link>)}
      </nav>
    </header>
  );
}

export function LearningOverview({ locale }: { locale: Locale }) {
  const t = text[locale];
  const [progress, setProgress] = useLearningProgress();
  const complete = Object.keys(progress.flashcards).length + Object.keys(progress.questions).length + progress.practice.length;
  return (
    <div className="v2-page learning-page">
      <LearningHeader locale={locale} current="/learn" />
      <section className="learning-dashboard page-shell-v2">
        <div className="learning-progress-strip">
          <strong>{t.progress}</strong>
          <span>{complete} / 162</span>
          <button type="button" onClick={() => setProgress(emptyProgress)}>{t.reset}</button>
        </div>
        <div className="learning-path-list">
          {learningModules.map((module, index) => {
            const copy = moduleCopy(module, locale);
            return (
              <article key={module.id} className={`learning-path project-${module.project}`}>
                <div><span className="learning-index mono">{String(index + 1).padStart(2, "0")}</span><span className="mono">{module.id}</span></div>
                <div><h2>{copy.title}</h2><p>{copy.summary}</p><Link href={`${localizedPath(locale, "/learn/flashcards")}?module=${module.id}`}>{t.open} →</Link></div>
                <LearningIllustration concept={module.illustration} title={copy.title} />
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function LearningPaths({ locale }: { locale: Locale }) {
  return <LearningOverview locale={locale} />;
}

export function FlashcardStudio({ locale }: { locale: Locale }) {
  const t = text[locale];
  const cards = getFlashcards(locale);
  const [progress, setProgress] = useLearningProgress();
  const [module, setModule] = useState("all");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const filtered = cards.filter((card) => module === "all" || card.module === module);
  const card = filtered[Math.min(index, filtered.length - 1)];
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("module");
    if (requested && learningModules.some((item) => item.id === requested)) setModule(requested);
  }, []);
  useEffect(() => { setIndex(0); setFlipped(false); }, [module]);
  function rate(value: "know" | "unsure" | "again") {
    setProgress({ ...progress, flashcards: { ...progress.flashcards, [card.id]: value } });
  }
  return (
    <div className="v2-page learning-page">
      <LearningHeader locale={locale} current="/learn/flashcards" />
      <section className="learning-studio page-shell-v2">
        <div className="learning-toolbar">
          <label><span>Module</span><select name="flashcard-module" value={module} onChange={(event) => setModule(event.target.value)}><option value="all">All · 60</option>{learningModules.map((item) => <option value={item.id} key={item.id}>{item.id} · {moduleCopy(item, locale).title}</option>)}</select></label>
          <span className="mono">{index + 1} / {filtered.length}</span>
        </div>
        {card ? (
          <article className={`flashcard project-${learningModules.find((item) => item.id === card.module)?.project || "trip-planner"}`}>
            <div className="flashcard-visual"><LearningIllustration concept={card.illustration.conceptId} title={card.illustration.alt} /></div>
            <div className="flashcard-copy">
              <span className="mono">{card.module} · {card.difficulty} · {flipped ? t.answer : t.front}</span>
              <h2>{flipped ? card.back.explanation : card.front.term}</h2>
              <p>{flipped ? card.back.example : card.front.prompt}</p>
              <small>{flipped ? card.back.dontConfuse : card.front.memoryHook}</small>
              <button type="button" className="flashcard-flip" onClick={() => setFlipped((value) => !value)}>{t.reveal}</button>
            </div>
          </article>
        ) : null}
        <div className="learning-actions">
          <button type="button" onClick={() => { setIndex((value) => Math.max(0, value - 1)); setFlipped(false); }} disabled={index === 0}>{t.previous}</button>
          <button type="button" onClick={() => rate("again")} aria-pressed={progress.flashcards[card?.id] === "again"}>{t.again}</button>
          <button type="button" onClick={() => rate("unsure")} aria-pressed={progress.flashcards[card?.id] === "unsure"}>{t.unsure}</button>
          <button type="button" onClick={() => rate("know")} aria-pressed={progress.flashcards[card?.id] === "know"}>{t.know}</button>
          <button type="button" onClick={() => { setIndex((value) => Math.min(filtered.length - 1, value + 1)); setFlipped(false); }} disabled={index === filtered.length - 1}>{t.next}</button>
        </div>
      </section>
    </div>
  );
}

export function QuestionBank({ locale }: { locale: Locale }) {
  const t = text[locale];
  const questions = getQuestions(locale);
  const [progress, setProgress] = useLearningProgress();
  const [module, setModule] = useState("all");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const filtered = questions.filter((question) => module === "all" || question.module === module);
  const question = filtered[Math.min(index, filtered.length - 1)];
  const expected = Array.isArray(question?.answer) ? question.answer : [question?.answer];
  const correct = checked && expected.length === selected.length && expected.every((answer) => selected.includes(answer as number));
  function toggle(option: number) {
    if (checked) return;
    const multiple = Array.isArray(question.answer);
    setSelected(multiple ? (selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]) : [option]);
  }
  function move(optionIndex: number, direction: -1 | 1) {
    const next = selected.length ? [...selected] : question.options.map((_, i) => i);
    const position = next.indexOf(optionIndex);
    const target = position + direction;
    if (position < 0 || target < 0 || target >= next.length) return;
    [next[position], next[target]] = [next[target], next[position]];
    setSelected(next);
  }
  function check() {
    setChecked(true);
    setProgress({ ...progress, questions: { ...progress.questions, [question.id]: expected.length === selected.length && expected.every((answer) => selected.includes(answer as number)) } });
  }
  function change(next: number) { setIndex(next); setSelected([]); setChecked(false); }
  return (
    <div className="v2-page learning-page">
      <LearningHeader locale={locale} current="/learn/question-bank" />
      <section className="learning-studio page-shell-v2">
        <div className="learning-toolbar">
          <label><span>Module</span><select name="question-module" value={module} onChange={(event) => { setModule(event.target.value); change(0); }}><option value="all">All · 90</option>{learningModules.map((item) => <option value={item.id} key={item.id}>{item.id}</option>)}</select></label>
          <span className="mono">{index + 1} / {filtered.length}</span>
        </div>
        {question ? (
          <article className="question-sheet">
            <span className="mono">{question.id} · {question.type} · {question.difficulty}</span>
            <h2>{question.prompt}</h2>
            <ol className="question-options">
              {question.options.map((option, optionIndex) => (
                <li key={option}>
                  <button type="button" onClick={() => toggle(optionIndex)} aria-pressed={selected.includes(optionIndex)}>{option}</button>
                  {question.type === "ordering" ? <span><button type="button" onClick={() => move(optionIndex, -1)} aria-label={`Move ${option} up`}>↑</button><button type="button" onClick={() => move(optionIndex, 1)} aria-label={`Move ${option} down`}>↓</button></span> : null}
                </li>
              ))}
            </ol>
            <button type="button" className="learning-check" onClick={check} disabled={!selected.length || checked}>{t.check}</button>
            {checked ? <div className={`answer-feedback ${correct ? "is-correct" : "is-incorrect"}`} role="status"><strong>{correct ? t.correct : t.incorrect}</strong><p><b>{t.explanation}:</b> {question.explanation}</p></div> : null}
          </article>
        ) : null}
        <div className="learning-actions">
          <button type="button" onClick={() => change(Math.max(0, index - 1))} disabled={index === 0}>{t.previous}</button>
          <button type="button" onClick={() => change(Math.min(filtered.length - 1, index + 1))} disabled={index === filtered.length - 1}>{t.next}</button>
        </div>
      </section>
    </div>
  );
}

export function PracticeStudio({ locale }: { locale: Locale }) {
  const t = text[locale];
  const activities = getPracticeActivities(locale);
  const [progress, setProgress] = useLearningProgress();
  const [activeIndex, setActiveIndex] = useState(0);
  const activity = activities[activeIndex];
  const complete = activity ? progress.practice.includes(activity.id) : false;

  function markDone() {
    if (!activity) return;
    setProgress({
      ...progress,
      practice: complete
        ? progress.practice.filter((id) => id !== activity.id)
        : [...progress.practice, activity.id],
    });
  }

  const isDnD = activity?.type === "ordering" || activity?.type === "classification";

  return (
    <div className="v2-page learning-page">
      <LearningHeader locale={locale} current="/learn/practice" />
      <section className="practice-studio-v2 page-shell-v2">
        {/* Activity navigation tabs */}
        <div className="practice-tabs" role="tablist" aria-label={locale === "vi" ? "Chọn bài tập" : "Select exercise"}>
          {activities.map((act, i) => (
            <button
              key={act.id}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => setActiveIndex(i)}
              className={`practice-tab${i === activeIndex ? " is-active" : ""}${progress.practice.includes(act.id) ? " is-done" : ""}`}
            >
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <span>{act.title}</span>
              {progress.practice.includes(act.id) && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>

        {activity && (
          <article className="practice-activity" aria-labelledby={`practice-title-${activity.id}`}>
            <header className="practice-activity-header">
              <span className="mono">{activity.module} · {activity.type}</span>
              <h2 id={`practice-title-${activity.id}`}>{activity.title}</h2>
            </header>

            {isDnD ? (
              <DragDropPractice activity={activity as Parameters<typeof DragDropPractice>[0]["activity"]} locale={locale} />
            ) : (
              <div className="practice-non-dnd">
                <p>{activity.instructions}</p>
                {"feedback" in activity && activity.feedback ? (
                  <details className="practice-feedback-drawer">
                    <summary>{t.explanation}</summary>
                    <p>{activity.feedback}</p>
                  </details>
                ) : null}
              </div>
            )}

            <div className="practice-mark-actions">
              <button
                type="button"
                aria-pressed={complete}
                className={`practice-mark-btn${complete ? " is-done" : ""}`}
                onClick={markDone}
              >
                {complete ? (locale === "vi" ? "✓ Đã xong" : "✓ Done") : (locale === "vi" ? "Đánh dấu xong" : "Mark as done")}
              </button>
            </div>
          </article>
        )}
      </section>
    </div>
  );
}

export function MockExamStudio({ locale }: { locale: Locale }) {
  const t = text[locale];
  const questions = getQuestions(locale);
  const [progress, setProgress] = useLearningProgress();
  const [presetIndex, setPresetIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const preset = examConfig.presets[presetIndex];
  const exam = useMemo(() => questions.slice(0, preset.questionCount), [preset.questionCount, questions]);
  function submit() {
    const score = exam.filter((question) => !Array.isArray(question.answer) && answers[question.id] === question.answer).length;
    const next = { score, total: exam.length };
    setResult(next);
    setProgress({ ...progress, exams: [...progress.exams, { ...next, date: new Date().toISOString() }] });
  }
  return (
    <div className="v2-page learning-page">
      <LearningHeader locale={locale} current="/learn/mock-exam" />
      <section className="exam-studio page-shell-v2">
        {!started ? (
          <div className="exam-cover">
            <h2>{t.exam}</h2>
            <label><span>Preset</span><select name="exam-preset" value={presetIndex} onChange={(event) => setPresetIndex(Number(event.target.value))}>{examConfig.presets.map((item, index) => <option value={index} key={item.id}>{item.questionCount} questions · {item.durationMinutes} min</option>)}</select></label>
            <p>{locale === "vi" ? "Đề chạy hoàn toàn cục bộ. Đồng hồ chỉ là tùy chọn định hướng; không tự nộp bài." : "The exam runs locally. Timing is advisory and never auto-submits."}</p>
            <button type="button" onClick={() => setStarted(true)}>{t.start}</button>
          </div>
        ) : (
          <>
            <ol className="exam-questions">
              {exam.map((question, index) => (
                <li key={question.id}>
                  <fieldset>
                    <legend><span className="mono">{String(index + 1).padStart(2, "0")}</span>{question.prompt}</legend>
                    {question.options.map((option, optionIndex) => <label key={option}><input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => setAnswers({ ...answers, [question.id]: optionIndex })} />{option}</label>)}
                  </fieldset>
                </li>
              ))}
            </ol>
            <button type="button" className="exam-submit" onClick={submit}>{t.submit}</button>
            {result ? <div className="exam-result" role="status"><strong>{t.score}: {result.score} / {result.total}</strong><p>{Math.round((result.score / result.total) * 100)}%</p></div> : null}
          </>
        )}
      </section>
    </div>
  );
}
