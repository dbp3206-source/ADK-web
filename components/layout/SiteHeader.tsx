"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { StaticLink as Link } from "@/components/layout/StaticLink";
import navigation from "@/content/navigation.json";
import { getOwnerName, getUtilityLinks } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ownerName = getOwnerName();
  const utilityLinks = getUtilityLinks();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
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

  const primaryLinks = navigation.primary;

  return (
    <header className="site-header">
      <div className="header-issue">
        <span>ADK AGENT ECOSYSTEM</span>
        <span>STATIC EVIDENCE EDITION · V0.1</span>
      </div>
      <div className="header-main">
        <Link className="wordmark" href="/" aria-label="ADK Agent Ecosystem home">
          {ownerName || "ADK / ECOSYSTEM"}
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryLinks.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" aria-current={pathname === "/contact" ? "page" : undefined}>
            Contact
          </Link>
        </nav>
        <button
          className="menu-trigger"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
          ref={triggerRef}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="mobile-menu-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <div
            className="mobile-menu"
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mobile-menu-head">
              <span className="mono">SYSTEM MAP</span>
              <button type="button" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <nav aria-label="Mobile navigation">
              {[...primaryLinks, { label: "Contact", href: "/contact" }].map((item, index) => (
                <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
                  <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            {utilityLinks.length > 0 ? (
              <div className="mobile-utility">
                {utilityLinks.map((item) => (
                  <a href={item.href} key={item.label} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
