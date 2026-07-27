"use client";

import { useState } from "react";

import { getDictionary, type Locale } from "@/lib/i18n";

export function CaseStudyTools({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="case-tools-v2">
      <button type="button" onClick={copy}>{copied ? dict.common.copied : dict.common.copy}</button>
      <button type="button" onClick={() => document.body.classList.toggle("paper-mode")}>{dict.common.paperMode}</button>
      <button type="button" onClick={() => window.print()}>{dict.common.print}</button>
    </div>
  );
}
