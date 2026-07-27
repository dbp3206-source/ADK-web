"use client";

import { usePathname } from "next/navigation";

import { StaticLink as Link } from "@/components/layout/StaticLink";
import { getDictionary, localeFromPath, localizedPath } from "@/lib/i18n";
import { getUtilityLinks } from "@/lib/site";

export function SiteFooter() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const dict = getDictionary(locale);
  const utilityLinks = getUtilityLinks();
  return (
    <footer className="site-footer site-footer-v2">
      <div className="footer-thesis">
        <span className="mono">ACT → DELEGATE → COMPUTE → COMPOSE → VERIFY → CONNECT</span>
        <p>{dict.footer.thesis}</p>
        <Link href={localizedPath(locale, "/system")}>{dict.footer.trace}</Link>
      </div>
      <div className="footer-map">
        <nav aria-label={dict.nav.footer}>
          {[
            [dict.nav.projects, "/projects"],
            [dict.nav.system, "/system"],
            [dict.nav.learn, "/learn"],
            [dict.nav.evidence, "/evidence"],
            [dict.nav.about, "/about"],
            [dict.nav.contact, "/contact"]
          ].map(([label, href]) => <Link href={localizedPath(locale, href)} key={href}>{label}</Link>)}
          {utilityLinks.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}
        </nav>
        <p className="mono">{dict.footer.colophon}</p>
      </div>
    </footer>
  );
}
