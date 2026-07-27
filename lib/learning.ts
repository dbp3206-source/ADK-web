import flashcardsEn from "@/content/learning/flashcards.en.json";
import flashcardsVi from "@/content/learning/flashcards.vi.json";
import mockExamConfig from "@/content/learning/mock-exam-config.json";
import practiceEn from "@/content/learning/practice-activities.en.json";
import practiceVi from "@/content/learning/practice-activities.vi.json";
import questionsEn from "@/content/learning/question-bank.en.json";
import questionsVi from "@/content/learning/question-bank.vi.json";
import type { Locale } from "@/lib/i18n";

export type LearningModule = {
  id: string;
  title: { vi: string; en: string };
  summary: { vi: string; en: string };
  project: string;
  illustration: string;
};

export const learningModules: LearningModule[] = [
  {
    id: "M1",
    title: { vi: "AI Agent khác chatbot như thế nào", en: "How AI agents differ from chatbots" },
    summary: { vi: "Hành động, observation, artifact và nhãn runtime trung thực.", en: "Actions, observations, artifacts and honest runtime labels." },
    project: "trip-planner",
    illustration: "ILL-02",
  },
  {
    id: "M2",
    title: { vi: "Cấu trúc một ADK Agent Project", en: "Anatomy of an ADK agent project" },
    summary: { vi: "Đọc `agent.py`, `root_agent`, tools, callbacks và output key.", en: "Read `agent.py`, `root_agent`, tools, callbacks and output keys." },
    project: "script-team",
    illustration: "ILL-05",
  },
  {
    id: "M3",
    title: { vi: "Tool, state, session và memory", en: "Tools, state, sessions and memory" },
    summary: { vi: "Hiểu dữ liệu nằm ở đâu, sống bao lâu và thay đổi thế nào.", en: "Understand where data lives, how long it lasts and how it changes." },
    project: "trip-planner",
    illustration: "ILL-12",
  },
  {
    id: "M4",
    title: { vi: "Các pattern điều khiển multi-agent", en: "Multi-agent control patterns" },
    summary: { vi: "So sánh Transfer, AgentTool, Sequential, Parallel và Loop.", en: "Compare Transfer, AgentTool, Sequential, Parallel and Loop." },
    project: "script-team",
    illustration: "ILL-15",
  },
  {
    id: "M5",
    title: { vi: "MCP, RAG và chất lượng dữ liệu", en: "MCP, RAG and data quality" },
    summary: { vi: "Nối tool/data, retrieval, phép tính và claim với evidence.", en: "Connect tools, retrieval, computation and claims to evidence." },
    project: "dashboard-insights",
    illustration: "ILL-19",
  },
  {
    id: "M6",
    title: { vi: "A2A, testing và service boundary", en: "A2A, testing and service boundaries" },
    summary: { vi: "Agent Card, timeout, retry, fallback, tracing và release honesty.", en: "Agent Cards, timeouts, retries, fallbacks, tracing and release honesty." },
    project: "a2a-orchestrator",
    illustration: "ILL-23",
  },
];

export type Flashcard = (typeof flashcardsVi)[number];
export type Question = (typeof questionsVi)[number];
export type PracticeActivity = (typeof practiceVi)[number];

export function getFlashcards(locale: Locale) {
  return (locale === "vi" ? flashcardsVi : flashcardsEn) as Flashcard[];
}

export function getQuestions(locale: Locale) {
  return (locale === "vi" ? questionsVi : questionsEn) as Question[];
}

export function getPracticeActivities(locale: Locale) {
  return (locale === "vi" ? practiceVi : practiceEn) as PracticeActivity[];
}

export const examConfig = mockExamConfig;

export function moduleCopy(module: LearningModule, locale: Locale) {
  return {
    title: module.title[locale],
    summary: module.summary[locale],
  };
}
