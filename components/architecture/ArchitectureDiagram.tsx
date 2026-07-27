import type { ReactNode } from "react";

import type { ArchitectureNode, Project } from "@/lib/types";

type Point = { x: number; y: number };

function genericPositions(nodes: ArchitectureNode[]) {
  const columns = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(nodes.length))));
  const rows = Math.ceil(nodes.length / columns);
  return Object.fromEntries(
    nodes.map((node, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      return [
        node.id,
        {
          x: 110 + column * (780 / Math.max(columns - 1, 1)),
          y: 100 + row * (300 / Math.max(rows - 1, 1))
        }
      ];
    })
  ) as Record<string, Point>;
}

function layoutForProject(project: Project): Record<string, Point> {
  if (project.slug === "a2a-orchestrator") {
    return {
      user: { x: 80, y: 245 },
      orchestrator: { x: 310, y: 245 },
      card: { x: 310, y: 72 },
      trip: { x: 625, y: 65 },
      script: { x: 625, y: 155 },
      worldcup: { x: 625, y: 245 },
      love: { x: 625, y: 335 },
      dashboard: { x: 625, y: 425 },
      artifact: { x: 900, y: 245 }
    };
  }
  if (project.slug === "dashboard-insights") {
    return {
      file: { x: 70, y: 95 },
      callback: { x: 225, y: 95 },
      framework: { x: 385, y: 95 },
      writer: { x: 545, y: 95 },
      qa: { x: 700, y: 95 },
      revision: { x: 700, y: 255 },
      formatter: { x: 865, y: 95 },
      mcp: { x: 300, y: 405 },
      rag: { x: 520, y: 405 },
      log: { x: 740, y: 405 },
      archive: { x: 920, y: 255 }
    };
  }
  return genericPositions(project.architecture.nodes);
}

function wrapLabel(label: string) {
  if (label.length <= 23) return [label];
  const words = label.split(" ");
  const lines: string[] = [""];
  for (const word of words) {
    const last = lines.length - 1;
    if (`${lines[last]} ${word}`.trim().length > 23 && lines.length < 3) {
      lines.push(word);
    } else {
      lines[last] = `${lines[last]} ${word}`.trim();
    }
  }
  return lines;
}

function NodeShape({ node }: { node: ArchitectureNode }) {
  const labelLines = wrapLabel(node.label);
  let shape: ReactNode;
  switch (node.type) {
    case "store":
      shape = (
        <>
          <path d="M-70 -25 C-70 -45 70 -45 70 -25 V28 C70 48 -70 48 -70 28 Z" />
          <ellipse cx="0" cy="-25" rx="70" ry="20" />
        </>
      );
      break;
    case "callback":
      shape = <path d="M0 -55 L78 0 L0 55 L-78 0 Z" />;
      break;
    case "artifact":
      shape = <path d="M-70 -45 H42 L70 -17 V45 H-70 Z M42 -45 V-17 H70" />;
      break;
    case "contract":
      shape = <path d="M-58 -45 H58 L78 -25 V25 L58 45 H-58 L-78 25 V-25 Z" />;
      break;
    case "remoteService":
      shape = (
        <>
          <rect x="-75" y="-46" width="150" height="92" rx="4" />
          <rect x="-68" y="-39" width="136" height="78" rx="2" />
        </>
      );
      break;
    case "workflow":
      shape = <rect x="-80" y="-48" width="160" height="96" rx="8" className="node-workflow-shape" />;
      break;
    case "tool":
    case "agentTool":
      shape = <path d="M-72 -42 H72 M-72 -42 V42 M72 -42 V42 M-72 42 H72" />;
      break;
    default:
      shape = <rect x="-75" y="-44" width="150" height="88" rx={node.type === "agent" ? 8 : 2} />;
  }

  return (
    <g className={`architecture-node-shape node-type-${node.type}`}>
      {shape}
      <text className="architecture-node-type" textAnchor="middle" y={-17}>
        {node.type}
      </text>
      {labelLines.map((line, index) => (
        <text className="architecture-node-label" textAnchor="middle" y={8 + index * 16} key={`${line}-${index}`}>
          {line}
        </text>
      ))}
    </g>
  );
}

export function ArchitectureDiagram({ project }: { project: Project }) {
  const positions = layoutForProject(project);
  return (
    <figure className={`architecture-figure project-${project.slug}`}>
      <div className="architecture-canvas" tabIndex={0} aria-label="Scrollable architecture diagram">
        <svg
          viewBox="0 0 1000 500"
          role="img"
          aria-label={`${project.title} architecture: ${project.architecture.summary}`}
        >
          <defs>
            <marker id={`${project.slug}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="architecture-arrow" />
            </marker>
          </defs>
          <g className="architecture-edges">
            {project.architecture.edges.map((edge, index) => {
              const start = positions[edge.from];
              const end = positions[edge.to];
              if (!start || !end) return null;
              const direction = end.x >= start.x ? 1 : -1;
              const startX = start.x + 82 * direction;
              const endX = end.x - 82 * direction;
              const midX = (startX + endX) / 2;
              const midY = (start.y + end.y) / 2;
              const bend = Math.abs(end.y - start.y) > 20 ? `M${startX},${start.y} C${midX},${start.y} ${midX},${end.y} ${endX},${end.y}` : `M${startX},${start.y} L${endX},${end.y}`;
              return (
                <g key={`${edge.from}-${edge.to}-${index}`}>
                  <path d={bend} markerEnd={`url(#${project.slug}-arrow)`} />
                  <text x={midX} y={midY - 8} textAnchor="middle">
                    {edge.label}
                  </text>
                </g>
              );
            })}
          </g>
          <g className="architecture-nodes">
            {project.architecture.nodes.map((node) => {
              const point = positions[node.id];
              if (!point) return null;
              return (
                <g transform={`translate(${point.x} ${point.y})`} key={node.id}>
                  <NodeShape node={node} />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <figcaption>
        <strong>Architecture summary.</strong> {project.architecture.summary}
      </figcaption>
      <details className="architecture-text">
        <summary>Read the diagram as text</summary>
        <p>Nodes:</p>
        <ul>
          {project.architecture.nodes.map((node) => (
            <li key={node.id}>
              {node.type}: {node.label}
            </li>
          ))}
        </ul>
        <p>Directed connections:</p>
        <ul>
          {project.architecture.edges.map((edge, index) => (
            <li key={`${edge.from}-${edge.to}-${index}`}>
              {edge.from} → {edge.to}: {edge.label}
            </li>
          ))}
        </ul>
      </details>
    </figure>
  );
}

export function ArchitectureLegend() {
  const types = [
    ["agent", "Agent"],
    ["tool", "Tool"],
    ["workflow", "Workflow"],
    ["store", "Store"],
    ["remoteService", "Remote service"],
    ["contract", "Contract"],
    ["artifact", "Artifact"]
  ];
  return (
    <ul className="architecture-legend" aria-label="Architecture symbol legend">
      {types.map(([type, label]) => (
        <li key={type}>
          <span className={`legend-mark legend-${type}`} aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}
