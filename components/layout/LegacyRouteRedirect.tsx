"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const legacyRoutes = ["/projects", "/system", "/learn", "/evidence", "/about", "/contact"];

export function LegacyRouteRedirect() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/" || /^\/(vi|en)(\/|$)/.test(pathname)) return;
    if (!legacyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) return;
    window.location.replace(`/vi${pathname}${window.location.search}${window.location.hash}`);
  }, [pathname]);
  return null;
}
