export function LearningIllustration({ concept, title }: { concept: string; title: string }) {
  const variant = Number(concept.replace(/\D/g, "")) % 6;
  return (
    <svg className={`learning-illustration illustration-${variant}`} viewBox="0 0 360 220" role="img" aria-label={title}>
      <rect x="1" y="1" width="358" height="218" rx="4" className="illustration-paper" />
      <path className="illustration-grid" d="M24 44H336M24 88H336M24 132H336M24 176H336M72 20V200M144 20V200M216 20V200M288 20V200" />
      {variant === 0 ? <>
        <circle cx="72" cy="110" r="30" className="illustration-node" />
        <path d="M102 110H164M196 110H258" className="illustration-signal" />
        <rect x="164" y="80" width="32" height="60" className="illustration-node" />
        <path d="M258 74h60v72h-60zM274 92h28M274 108h28M274 124h18" className="illustration-node" />
      </> : null}
      {variant === 1 ? <>
        <path d="M42 48h112v124H42zM206 48h112v124H206z" className="illustration-node" />
        <path d="M154 110h52M180 110l-12-12m12 12-12 12" className="illustration-signal" />
        <path d="M62 76h72M62 98h52M62 120h64M226 76h72M226 98h42M226 120h58" className="illustration-detail" />
      </> : null}
      {variant === 2 ? <>
        <path d="M40 70h76v80H40zM142 48h76v124h-76zM244 70h76v80h-76z" className="illustration-node" />
        <path d="M116 110h26M218 110h26" className="illustration-signal" />
        <circle cx="180" cy="110" r="16" className="illustration-accent" />
      </> : null}
      {variant === 3 ? <>
        <circle cx="180" cy="110" r="66" className="illustration-node" />
        <path d="M180 44v132M114 110h132M134 64l92 92M226 64l-92 92" className="illustration-detail" />
        <circle cx="180" cy="110" r="18" className="illustration-accent" />
      </> : null}
      {variant === 4 ? <>
        <path d="M48 156V84l50-34 50 34v72zM212 156V84l50-34 50 34v72z" className="illustration-node" />
        <path d="M148 110h64M180 110l-14-14m14 14-14 14" className="illustration-signal" />
        <circle cx="98" cy="112" r="18" className="illustration-accent" />
        <circle cx="262" cy="112" r="18" className="illustration-accent" />
      </> : null}
      {variant === 5 ? <>
        <path d="M48 72h78v78H48zM141 44h78v78h-78zM234 72h78v78h-78z" className="illustration-node" />
        <path d="M126 96h15M219 96h15M87 150v24h186v-24" className="illustration-signal" />
        <path d="M73 96h28M166 68h28M259 96h28" className="illustration-detail" />
      </> : null}
      <text x="24" y="204" className="illustration-label">{concept}</text>
    </svg>
  );
}
