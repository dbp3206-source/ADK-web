import a2a01 from "@/content/replays/a2a-01.json";
import a2a02 from "@/content/replays/a2a-02.json";
import a2a03 from "@/content/replays/a2a-03.json";
import di01 from "@/content/replays/di-01.json";
import di02 from "@/content/replays/di-02.json";
import di03 from "@/content/replays/di-03.json";
import la01 from "@/content/replays/la-01.json";
import la02 from "@/content/replays/la-02.json";
import la03 from "@/content/replays/la-03.json";
import st01 from "@/content/replays/st-01.json";
import st02 from "@/content/replays/st-02.json";
import st03 from "@/content/replays/st-03.json";
import tp01 from "@/content/replays/tp-01.json";
import tp02 from "@/content/replays/tp-02.json";
import tp03 from "@/content/replays/tp-03.json";
import wc01 from "@/content/replays/wc-01.json";
import wc02 from "@/content/replays/wc-02.json";
import wc03 from "@/content/replays/wc-03.json";
import rootAgentData from "@/content/v22/root-agents.json";

export type ReplayMode =
  | "verified-local-replay"
  | "verified-mocked-replay"
  | "browser-simulation"
  | "live-execution";

export type ReplayEventType =
  | "input_received"
  | "validation"
  | "routing"
  | "handoff"
  | "agent_started"
  | "tool_call"
  | "tool_result"
  | "state_read"
  | "state_write"
  | "retrieval"
  | "calculation"
  | "qa_check"
  | "revision"
  | "retry"
  | "fallback"
  | "artifact_created"
  | "completed"
  | "failed";

export type ReplayEvent = {
  sequence: number;
  actor: string;
  type: ReplayEventType;
  summary: string;
  details?: Record<string, unknown>;
  stateDiff?: Record<string, unknown>;
  timestamp?: string;
};

export type ReplayCase = {
  caseId: string;
  project: string;
  mode: ReplayMode;
  title: string;
  description?: string;
  status: "passed" | "failed" | "blocked";
  sourceCommit?: string;
  verifiedAt?: string;
  runCommand?: string;
  input: Record<string, unknown>;
  events: ReplayEvent[];
  output: unknown;
  expected?: unknown;
  assertions: Array<{ name: string; passed: boolean; details?: string }>;
  source: {
    agentPath: string;
    testPath: string;
    rootAgentStartLine: number | null;
    rootAgentEndLine: number | null;
  };
  externalDependencies?: Array<{
    name: string;
    mode: "real" | "mocked" | "not-used" | "blocked";
    fixture?: string;
  }>;
  redactions: string[];
};

export type RootAgentEvidence = {
  project: string;
  sourceStatus: string;
  sourceCommit: string | null;
  path: string;
  startLine: number;
  endLine: number;
  sha256: string;
  source: string;
  structure: {
    className: string;
    workflowType: string;
    name?: string;
    model?: string;
    description?: string;
    instruction?: string;
    tools?: string[];
    subAgents?: string[];
    callbacks?: Array<{ hook: string; callable: string }>;
    outputKey?: string;
  };
  tests: string[];
};

export const replayCases = [
  tp01,
  tp02,
  tp03,
  st01,
  st02,
  st03,
  wc01,
  wc02,
  wc03,
  la01,
  la02,
  la03,
  di01,
  di02,
  di03,
  a2a01,
  a2a02,
  a2a03,
] as ReplayCase[];

export const rootAgents = rootAgentData as RootAgentEvidence[];

export function getProjectReplays(slug: string) {
  return replayCases.filter((item) => item.project === slug);
}

export function getRootAgent(slug: string) {
  return rootAgents.find((item) => item.project === slug);
}

