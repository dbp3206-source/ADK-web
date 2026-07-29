"use client";

import { usePathname } from "next/navigation";

import { StaticLink as Link } from "@/components/layout/StaticLink";
import { getDictionary, localeFromPath, localizedPath } from "@/lib/i18n";
import type { ReleaseMetadata } from "@/lib/release";
import { getUtilityLinks } from "@/lib/site";

export function SiteFooter({ release }: { release: ReleaseMetadata }) {
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
            [dict.nav.contact, "/contact"]
          ].map(([label, href]) => <Link href={localizedPath(locale, href)} key={href}>{label}</Link>)}
          {utilityLinks.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}
        </nav>
        <div className="footer-build">
          <p className="mono">{dict.footer.colophon}</p>
          <p className="mono" aria-label={`Release ${release.version}`}>
            v{release.version} · {release.commit} · {release.builtAt.slice(0, 10)} · {release.environment}
          </p>
        </div>
      </div>
    </footer>
  );
}
