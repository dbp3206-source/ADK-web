"use client";

import { useState } from "react";

export function CopyEmailButton({ email, label, copiedLabel }: { email: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return <button type="button" onClick={copy} data-state={copied ? "success" : undefined}>{copied ? copiedLabel : label}</button>;
}
