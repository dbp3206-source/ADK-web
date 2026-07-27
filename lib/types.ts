export type EvidenceStatus =
  | "implemented_in_source"
  | "verified_locally"
  | "proposed_upgrade"
  | "needs_user_input";

export type ArchitectureNodeType =
  | "user"
  | "input"
  | "agent"
  | "agentTool"
  | "tool"
  | "workflow"
  | "callback"
  | "store"
  | "remoteService"
  | "contract"
  | "artifact";

export interface ArchitectureNode {
  id: string;
  type: ArchitectureNodeType;
  label: string;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label: string;
}

export interface EvidenceItem {
  type: "source" | "test" | "schema" | "contract" | "screenshot" | "commit";
  label: string;
  status: EvidenceStatus;
  path: string;
}

export interface Project {
  slug: string;
  index: number;
  verb: "ACT" | "DELEGATE" | "COMPUTE" | "COMPOSE" | "VERIFY" | "CONNECT";
  title: string;
  thesis: string;
  lesson: string;
  patterns: string[];
  vibe: {
    name: string;
    accent: string;
    surface: string;
    metaphor: string;
    layout: string;
    components: string[];
    motion: string;
    avoid: string[];
  };
  problem: string;
  architecture: {
    summary: string;
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
  };
  requestTrace: string[];
  designDecisions: string[];
  limitations: string[];
  roadmap: string[];
  evidence: EvidenceItem[];
  samplePrompt: string;
  sampleArtifact: string;
  status: string;
}

export interface TraceStep {
  id: number;
  type: "input" | "routing" | "remote" | "workflow" | "parallel" | "loop" | "tool" | "validation" | "artifact";
  title: string;
  detail: string;
}

export interface TracePreset {
  id: string;
  label: string;
  targetProject: string;
  simulated: boolean;
  steps: TraceStep[];
}

export interface Lesson {
  slug: string;
  title: string;
  thesis: string;
  quick: string[];
  detail: { heading: string; body: string }[];
  relatedProject: string;
  checks: { question: string; options: string[]; answer: number; explanation: string }[];
}
