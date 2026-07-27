# DEPLOYMENT PLAN

## Architecture
MVP is a static-first Next.js site. A live agent backend is not required.

## Environments

### Local
Build and debug only. Never present localhost as final delivery.

### Preview
Shareable review URL on Vercel or Cloudflare Pages. Prefer unlisted access until approved.

### Staging
Optional stable URL for Playwright, accessibility and route-refresh validation.

### Production
Public HTTPS portfolio domain. Set canonical URL only after a real deployment returns it. Keep rollback to the previous successful release.

## Environment variables
Static MVP should need none for public functionality. Future analytics, contact service or live-agent endpoint require a privacy/security decision. Never expose API keys in client bundles.

## Future live backend
Separate service; server-side proxy; rate limit; file validation; secret manager; health checks; timeout/retry/backoff/circuit breaker; redacted trace; static fallback; retention/deletion policy.

## Release sequence
1. Build static content.
2. Validate source policy and missing links.
3. Run automated tests.
4. Run manual viewport and keyboard QA.
5. Create preview.
6. Collect change requests.
7. Run regression.
8. Deploy production only after Critical tests pass.

## Link delivery template
Local preview: Not available until build  
Shareable preview: Not available until deployment  
Production: Not deployed  
Embed: Not enabled  
Access: To be decided  
Version: v0.1 handoff  
Known limitations: owner details, repository evidence and verified screenshots are pending
