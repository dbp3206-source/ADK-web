"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { StaticLink as Link } from "@/components/layout/StaticLink";
import { getDictionary, localeFromPath, localizedPath } from "@/lib/i18n";
import { getOwnerName, getUtilityLinks } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const dict = getDictionary(locale);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ownerName = getOwnerName();
  const utilityLinks = getUtilityLinks();
  const nav = [
    [dict.nav.home, "/"],
    [dict.nav.projects, "/projects"],
    [dict.nav.system, "/system"],
    [dict.nav.learn, "/learn"],
    [dict.nav.contact, "/contact"]
  ] as const;
  const cleanPath = pathname.replace(/^\/(vi|en)/, "") || "/";
  const otherLocale = locale === "vi" ? "en" : "vi";

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  const isCurrent = (href: string) => {
    const target = localizedPath(locale, href);
    return pathname === target || (href !== "/" && pathname.startsWith(`${target}/`));
  };
  const preserveLocaleQuery = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.location.assign(`${localizedPath(otherLocale, cleanPath)}${window.location.search}${window.location.hash}`);
  };

  return (
    <>
    <a className="skip-link" href="#main-content">{dict.common.skip}</a>
    <header className="site-header site-header-v2">
      <div className="header-signal">
        <span>ADK AGENT ECOSYSTEM</span>
        <span>{locale === "vi" ? "INTERACTIVE AGENT FIELD GUIDE" : "INTERACTIVE AGENT FIELD GUIDE"}</span>
      </div>
      <div className="header-main">
        <Link className="wordmark" href={localizedPath(locale, "/")} aria-label={`ADK / ECOSYSTEM — ${dict.nav.home}`}>
          {ownerName || "ADK / ECOSYSTEM"}
        </Link>
        <nav className="desktop-nav" aria-label={dict.nav.primary}>
          {nav.map(([label, href]) => (
            <Link href={localizedPath(locale, href)} key={href} aria-current={isCurrent(href) ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="command-trigger" onClick={() => window.dispatchEvent(new CustomEvent("adk:command-open"))} title={dict.command.title}>
            <span>{dict.command.short}</span><kbd>⌘K</kbd>
          </button>
          <Link className="locale-toggle" href={localizedPath(otherLocale, cleanPath)} onClick={preserveLocaleQuery} aria-label={locale === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"}>
            {otherLocale.toUpperCase()}
          </Link>
          <button className="menu-trigger" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)} ref={triggerRef}>
            {dict.common.menu}
          </button>
        </div>
      </div>
      {open ? (
        <div className="mobile-menu-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <div className="mobile-menu" id="mobile-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label={dict.nav.primary} onMouseDown={(event) => event.stopPropagation()}>
            <div className="mobile-menu-head"><span className="mono">SYSTEM MAP / {locale.toUpperCase()}</span><button type="button" onClick={() => setOpen(false)}>{dict.common.close}</button></div>
            <nav aria-label={dict.nav.primary}>
              {nav.map(([label, href], index) => (
                <Link href={localizedPath(locale, href)} key={href}><span className="mono">{String(index + 1).padStart(2, "0")}</span>{label}</Link>
              ))}
            </nav>
            <div className="mobile-utility">
              <Link href={localizedPath(otherLocale, cleanPath)} onClick={preserveLocaleQuery}>{otherLocale.toUpperCase()}</Link>
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("adk:command-open"))}>{dict.command.title}</button>
              {utilityLinks.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}
            </div>
          </div>
        </div>
      ) : null}
    </header>
    </>
  );
}
