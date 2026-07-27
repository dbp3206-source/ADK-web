import { describe, expect, it } from "vitest";

import { getFlashcards, getPracticeActivities, getQuestions } from "@/lib/learning";
import { replayCases, rootAgents } from "@/lib/replays";

describe("V2.2 verified content", () => {
  it("keeps VI and EN learning seeds in exact ID parity", () => {
    const pairs = [
      [getFlashcards("vi"), getFlashcards("en"), 60],
      [getQuestions("vi"), getQuestions("en"), 90],
      [getPracticeActivities("vi"), getPracticeActivities("en"), 12],
    ] as const;
    for (const [vi, en, count] of pairs) {
      expect(vi).toHaveLength(count);
      expect(en).toHaveLength(count);
      expect(en.map((item) => item.id)).toEqual(vi.map((item) => item.id));
    }
  });

  it("provides three replay cases for all six projects", () => {
    expect(replayCases).toHaveLength(18);
    const counts = Object.groupBy(replayCases, (item) => item.project);
    expect(Object.values(counts).map((items) => items?.length)).toEqual([3, 3, 3, 3, 3, 3]);
    expect(replayCases.some((item) => item.mode === "live-execution")).toBe(false);
  });

  it("contains observable events without private paths or chain-of-thought fields", () => {
    const serialized = JSON.stringify(replayCases);
    expect(serialized).not.toMatch(/[A-Z]:\\\\Users\\\\/i);
    expect(serialized).not.toMatch(/AIza[0-9A-Za-z_-]{20,}|api[_-]?key["']?\s*[:=]\s*["'][^"']+|chain[_ -]?of[_ -]?thought/i);
    for (const replay of replayCases) {
      expect(replay.events.length).toBeGreaterThan(0);
      expect(replay.assertions.length).toBeGreaterThan(0);
      expect(replay.status).toBe("passed");
    }
  });

  it("exposes five exact root-agent assignments and no invented commit", () => {
    expect(rootAgents).toHaveLength(5);
    for (const evidence of rootAgents) {
      expect(evidence.source).toMatch(/^root_agent\s*=/);
      expect(evidence.startLine).toBeGreaterThan(0);
      expect(evidence.endLine).toBeGreaterThanOrEqual(evidence.startLine);
      expect(evidence.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(evidence.sourceCommit).toBeNull();
    }
  });
});
