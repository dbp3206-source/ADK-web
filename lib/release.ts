export interface ReleaseMetadata {
  version: string;
  commit: string;
  builtAt: string;
  environment: string;
}

export function getReleaseMetadata(): ReleaseMetadata {
  const fullCommit =
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ??
    "local";

  return {
    version: "3.6.0",
    commit: fullCommit === "local" ? fullCommit : fullCommit.slice(0, 7),
    builtAt: process.env.NEXT_PUBLIC_BUILD_DATE ?? new Date().toISOString(),
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "local"
  };
}
