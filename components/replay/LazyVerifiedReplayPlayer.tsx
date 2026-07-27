"use client";

import dynamic from "next/dynamic";

import type { Locale } from "@/lib/i18n";

const VerifiedReplayPlayer = dynamic(
  () => import("./VerifiedReplayPlayer").then((module) => module.VerifiedReplayPlayer),
  {
    loading: () => <div className="replay-loading" role="status">Loading replay interface…</div>,
  },
);

export function LazyVerifiedReplayPlayer({
  slug,
  locale,
  compact = false,
}: {
  slug: string;
  locale: Locale;
  compact?: boolean;
}) {
  return <VerifiedReplayPlayer slug={slug} locale={locale} compact={compact} />;
}
