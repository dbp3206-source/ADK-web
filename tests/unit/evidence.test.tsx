import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EvidenceBadge, allowedEvidenceLabels } from "@/components/evidence/EvidenceBadge";

describe("evidence statuses", () => {
  it("exposes only the four approved labels", () => {
    expect(allowedEvidenceLabels).toEqual([
      "Implemented in source",
      "Verified locally",
      "Proposed upgrade",
      "Needs verification"
    ]);
  });

  it("renders text and a non-color symbol", () => {
    render(<EvidenceBadge status="needs_user_input" />);
    expect(screen.getByText("Needs verification")).toBeInTheDocument();
    expect(screen.getByText("○")).toBeInTheDocument();
  });
});
