"use client";

import { useEffect } from "react";

export function RouteRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(`${to}${window.location.search}`);
  }, [to]);
  return (
    <main className="v2-page redirect-page" aria-live="polite">
      <p>Redirecting… <a href={to}>Continue</a></p>
    </main>
  );
}
