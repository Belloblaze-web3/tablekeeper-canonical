# Tablekeeper implementation plan

## Outcome

Ship a runnable, clean-room restaurant reservation clone for the tablekeeper track. The user can search a curated restaurant directory, filter by city/date/party size/cuisine, inspect time-slot availability, reserve a table, view reservations, and cancel them. The core service guarantees no double-booking under concurrent calls, handles idempotent retries, and preserves the restaurant's local timezone for slot semantics.

## Architecture

- **Frontend:** React + Vite + Tailwind CSS, browser-rendered SPA. The page is public and can be served as static assets.
- **Backend:** Express on the same origin. `/api/*` serves dynamic restaurant, availability, reservation, cancellation, and health endpoints. Express serves the built SPA in production.
- **Domain core:** `server/tablekeeper.ts` contains a synchronous, dependency-light reservation engine with deterministic seed data. It is the testable reference implementation and a safe offline fallback when no database is present.
- **Persistence seam:** Drizzle schema adds restaurants, tables, and reservations with unique/idempotency indexes. `FACTORY.md` documents the production transaction boundary for a MySQL-backed deployment; the demo engine makes the behavior reproducible without outbound network.
- **Verification:** Vitest tests cover concurrent booking races, idempotency, cancellation, party-size filtering, and DST/timezone-safe slot handling. `pnpm check`, `pnpm test`, and `pnpm build` are the delivery checks.

## Delivery and caching

The app uses a static frontend plus container backend shape. The backend owns `/api/*` and `/api/health`; the SPA owns `/` and browser routes. Versioned Vite assets are safe for immutable caching; HTML and API responses stay revalidated or no-store. The current local preview uses the Web Dev port contract and the root Dockerfile's `PORT` contract.

## Project structure

- `client/src/pages/Home.tsx` — discovery, booking, and reservation UI.
- `client/src/index.css` — Tablekeeper visual system and responsive layout.
- `server/tablekeeper.ts` — domain model and atomic reservation engine.
- `server/_core/index.ts` — Express server and HTTP API routes.
- `drizzle/schema.ts` — production persistence schema and uniqueness constraints.
- `tests/tablekeeper.test.ts` — domain tests.
- `stage-1/` through `stage-4/` — build evidence and complete-stage notes.
- `band/` — generic mandates, stage prompts, and room evidence checklist.

## Acceptance checks

1. Search and filter controls return coherent restaurant cards and slots.
2. A reservation is not shown as confirmed until the server returns success.
3. Two calls for the same table/slot cannot both succeed, even when started together.
4. Repeating an idempotency key returns the original reservation rather than creating another booking.
5. Cancellation releases capacity and is safe to repeat.
6. Time slots are interpreted in the restaurant's named timezone, including DST transitions.
7. The repository builds and starts from a clean container with no outbound network.
8. BAND mandates remain generic and do not mention track-specific endpoints, fields, or error codes.
