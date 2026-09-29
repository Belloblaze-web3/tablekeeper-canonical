# Stage 2 — safe booking core

This stage adds the invariant that one physical table cannot be confirmed twice for one restaurant-local date/time, plus idempotent retries and cancellation. The pure domain engine makes the result deterministic without outbound network access.

**Acceptance:** `pnpm test -- tests/tablekeeper.test.ts` proves a concurrent race produces one winner, eleven conflicts for the six-person fixture, a repeated idempotency key replays one reservation, and cancellation releases capacity.

**Evidence:** `server/tablekeeper.ts`, `tests/tablekeeper.test.ts`, `drizzle/schema.ts`.
