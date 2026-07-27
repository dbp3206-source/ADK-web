# Delivery

The editable website is the Next.js application at the repository root.

The verified static export is generated in `out/` with:

```text
npm install
npm run build
```

Local review:

```text
node scripts/static-server.mjs
```

Then open `http://127.0.0.1:4173`.

Production deployment is intentionally withheld until preview approval.
