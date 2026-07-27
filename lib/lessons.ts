import type { Lesson } from "@/lib/types";

export const lessons: Lesson[] = [
  {
    slug: "agent-vs-chatbot",
    title: "Agent vs chatbot",
    thesis: "A chatbot answers; an agent can decide, act, observe and continue.",
    quick: [
      "A language model reads and generates language.",
      "An agent adds an action loop: observe, decide, call a tool, inspect the result and continue.",
      "Trip Planner crosses the boundary by saving and retrieving session state through real tools."
    ],
    detail: [
      {
        heading: "The loop",
        body: "An agent observes the request and available context, decides what is missing, acts through a permitted tool or handoff, observes the result and repeats until it can return a useful outcome."
      },
      {
        heading: "The runtime boundary",
        body: "The model selects a tool and proposes structured arguments. The runtime validates those arguments and calls the actual Python function. The model must not claim that an action happened unless the runtime returned evidence."
      },
      {
        heading: "What changes",
        body: "Tools decide what the system can touch. State decides what the current session can remember. Guardrails decide what the agent cannot do."
      }
    ],
    relatedProject: "trip-planner",
    checks: [
      {
        question: "What makes the tool call real?",
        options: ["The model describes it", "The runtime executes it", "The user repeats it"],
        answer: 1,
        explanation: "The runtime validates arguments and executes the function."
      },
      {
        question: "What is state?",
        options: ["A permanent database", "Structured session data", "A model parameter"],
        answer: 1,
        explanation: "State is structured temporary data attached to a working session."
      },
      {
        question: "What should happen after a tool result?",
        options: ["The agent observes it", "The browser reloads", "The prompt is discarded"],
        answer: 0,
        explanation: "The result becomes new context for the next decision."
      }
    ]
  },
  {
    slug: "file-anatomy",
    title: "Project file anatomy",
    thesis: "Every file should answer one question: why does it exist?",
    quick: [
      "agent.py declares the root agent, model, instructions, tools and sub-agents.",
      ".env keeps local secrets; .env.example names required variables without values.",
      "Tool code, smoke tests, requirements and run scripts keep execution inspectable."
    ],
    detail: [
      {
        heading: "Agent declaration",
        body: "The root agent is the entry point. Its description supports routing; its instruction defines durable rules; its tool list bounds the actions available to the model."
      },
      {
        heading: "Tools and schemas",
        body: "Tool functions contain the executable work. Type hints and schemas let the runtime reject invalid inputs before a function touches files, data or services."
      },
      {
        heading: "Configuration and tests",
        body: "Secrets remain outside source control. Requirements match real imports. Smoke tests exercise tools independently so a tool defect is not confused with an instruction or routing defect."
      }
    ],
    relatedProject: "script-team",
    checks: [
      {
        question: "Where should an API key live?",
        options: [".env", "README.md", "agent.py"],
        answer: 0,
        explanation: "Local secrets belong in .env and must not be committed."
      },
      {
        question: "What does a tool schema protect?",
        options: ["Brand colors", "Input structure", "Navigation order"],
        answer: 1,
        explanation: "The schema defines and validates the tool’s input contract."
      },
      {
        question: "Why test tools separately?",
        options: ["To make the prompt longer", "To isolate defects", "To create screenshots"],
        answer: 1,
        explanation: "Separate tests distinguish tool failures from model or instruction failures."
      }
    ]
  },
  {
    slug: "multi-agent-patterns",
    title: "Four multi-agent patterns",
    thesis: "Choose a pattern by control, independence and workflow certainty.",
    quick: [
      "Transfer gives the next specialist ownership.",
      "Agent as Tool keeps the root in control.",
      "Workflow agents encode order, parallel branches or bounded loops.",
      "A2A connects independent agent services across a network boundary."
    ],
    detail: [
      {
        heading: "Transfer",
        body: "Use transfer when the next specialist should own the conversation step. Script Team makes Drafter, Critic and Reviser explicit owners."
      },
      {
        heading: "Agent as Tool",
        body: "Use AgentTool when the root agent should call a specialist capability and receive the result back. World Cup Analyst separates search and calculation this way."
      },
      {
        heading: "Workflow and remote agents",
        body: "Use workflow agents when the order must be deterministic. Use A2A when the collaborators are independent services with capability contracts, endpoints and protocol costs."
      }
    ],
    relatedProject: "a2a-orchestrator",
    checks: [
      {
        question: "Who controls Agent as Tool?",
        options: ["The root agent", "The browser", "The data store"],
        answer: 0,
        explanation: "The root calls the specialist as a bounded capability."
      },
      {
        question: "When is ParallelAgent useful?",
        options: ["Branches are independent", "Every step depends on the last", "A service is offline"],
        answer: 0,
        explanation: "Independent work can proceed without waiting for another branch."
      },
      {
        question: "What changes with A2A?",
        options: ["The font", "The service boundary", "The JSON syntax"],
        answer: 1,
        explanation: "A2A introduces independent services and network contracts."
      }
    ]
  },
  {
    slug: "mcp-vs-a2a",
    title: "MCP vs A2A",
    thesis: "MCP connects an agent to tools and data; A2A connects independent agents.",
    quick: [
      "MCP is a consistent interface for tool and data access.",
      "A2A is a protocol for discovery, messages, tasks and artifacts between agent systems.",
      "Dashboard Insights demonstrates MCP concepts; the Orchestrator demonstrates A2A topology."
    ],
    detail: [
      {
        heading: "MCP",
        body: "Model Context Protocol gives an agent a consistent way to call permitted tools and reach data. The important boundary is agent-to-capability."
      },
      {
        heading: "A2A",
        body: "Agent2Agent Protocol lets independent systems describe capabilities with an Agent Card, receive messages or tasks and return artifacts. The important boundary is service-to-service."
      },
      {
        heading: "Operational cost",
        body: "Remote calls add versioning, authentication, timeout, retry, fallback and cross-service tracing requirements. Those are proposed hardening steps here, not claimed live behavior."
      }
    ],
    relatedProject: "dashboard-insights",
    checks: [
      {
        question: "Which protocol connects a filesystem tool?",
        options: ["MCP", "A2A", "CSS"],
        answer: 0,
        explanation: "MCP connects agents to tools and data sources."
      },
      {
        question: "What describes an A2A capability?",
        options: ["Agent Card", "Session state", "Font manifest"],
        answer: 0,
        explanation: "An Agent Card publishes capability and endpoint information."
      },
      {
        question: "What is an artifact?",
        options: ["A durable output", "A hover state", "A secret key"],
        answer: 0,
        explanation: "An artifact is a report, file or structured result created by an agent."
      }
    ]
  }
];

export function getLesson(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}
