import type { EvidenceStatus } from "@/lib/types";

const labels: Record<EvidenceStatus, string> = {
  implemented_in_source: "Implemented in source",
  verified_locally: "Verified locally",
  proposed_upgrade: "Proposed upgrade",
  needs_user_input: "Needs verification"
};

const symbols: Record<EvidenceStatus, string> = {
  implemented_in_source: "◆",
  verified_locally: "✓",
  proposed_upgrade: "→",
  needs_user_input: "○"
};

export function EvidenceBadge({ status }: { status: EvidenceStatus }) {
  return (
    <span className={`evidence-badge evidence-${status}`}>
      <span aria-hidden="true">{symbols[status]}</span>
      {labels[status]}
    </span>
  );
}

export const allowedEvidenceLabels = Object.values(labels);
