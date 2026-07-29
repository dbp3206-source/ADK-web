"use client";

import { useEffect, useState } from "react";

export function InteractiveContactLink({
  href,
  label,
  display,
  external,
}: {
  href: string;
  label: string;
  display: string;
  external: boolean;
}) {
  const storageKey = `contact-link-tone:${label.toLowerCase()}`;
  const [tone, setTone] = useState(0);

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(storageKey));
    if (Number.isInteger(saved) && saved >= 0 && saved < 5) setTone(saved);
  }, [storageKey]);

  const cycleTone = () => {
    setTone((current) => {
      const next = (current + 1) % 5;
      window.localStorage.setItem(storageKey, String(next));
      return next;
    });
  };

  return (
    <a
      className={`contact-neon-link contact-neon-tone-${tone}`}
      href={href}
      onClick={cycleTone}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      title={`${label}: ${display}`}
    >
      {display}
    </a>
  );
}
