# Stage 4 — release and evidence

This stage packages the clean-container service, BAND factory documentation, generic mandates, stage prompts, route manifest, schema, and measured verification notes.

**Acceptance:** `pnpm check`, `pnpm test`, and `pnpm build` pass; `pnpm start` serves the built application on `PORT`; `GET /api/health` returns 2xx; `GET /manus-routes.json` returns a valid route declaration; no BAND credentials are committed.

**Evidence:** `FACTORY.md`, `band/mandates/`, `band/prompts/`, `Dockerfile`, `plan.md`, `ideas.md`.
