import { StaticLink as Link } from "@/components/layout/StaticLink";

export default function NotFound() {
  return (
    <div className="page-shell not-found-page">
      <p className="not-found-index mono">404</p>
      <h1>This route is outside the current system map.</h1>
      <p>Return to the portfolio, browse the projects or open the A2A explorer.</p>
      <nav aria-label="404 recovery links">
        <Link className="primary-action" href="/">Home</Link>
        <Link className="secondary-action" href="/projects">Projects</Link>
        <Link className="secondary-action" href="/system">System</Link>
      </nav>
    </div>
  );
}
