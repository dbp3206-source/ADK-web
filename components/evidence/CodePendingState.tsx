export function CodePendingState() {
  return (
    <section className="code-pending" aria-labelledby="code-evidence-title">
      <div>
        <p className="mono">SOURCE EXCERPT · PENDING</p>
        <h2 id="code-evidence-title">Verified code only.</h2>
      </div>
      <p>
        No repository path or excerpt has been supplied. This section will show 10–25 verified lines only after the
        source file, commit and implementation status are confirmed.
      </p>
    </section>
  );
}
