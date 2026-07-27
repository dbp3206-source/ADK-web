import { StaticLink as Link } from "@/components/layout/StaticLink";
import navigation from "@/content/navigation.json";
import { getUtilityLinks } from "@/lib/site";

export function SiteFooter() {
  const utilityLinks = getUtilityLinks();
  return (
    <footer className="site-footer">
      <div className="footer-thesis">
        <p>Not six chatbots. Six architectural steps toward an agent ecosystem.</p>
        <Link href="/system">Follow a request across the system</Link>
      </div>
      <div className="footer-colophon mono">
        <p>
          ADK Agent Ecosystem Portfolio · v0.1 · English-first static evidence edition · Simulation data derived from
          repository architecture · Owner evidence pending · No live agent backend · No visitor prompt or file collection.
        </p>
        <nav aria-label="Footer navigation">
          {navigation.footer.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/contact">Contact</Link>
          {utilityLinks.map((item) => (
            <a href={item.href} key={item.label} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
