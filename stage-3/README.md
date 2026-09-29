# Stage 3 — timezone edges and polish

This stage adds restaurant timezone metadata, local opening-hour slot generation, half-hour boundaries, DST-safe date handling through local date strings, and the responsive editorial UI with explicit unavailable/confirmation states.

**Acceptance:** the slot test starts at local opening and ends at local close, UI shows the restaurant timezone, unavailable slots cannot be submitted, and mobile layout collapses into a single column.

**Evidence:** `server/tablekeeper.ts`, `tests/tablekeeper.test.ts`, `client/src/index.css`, `client/src/pages/Home.tsx`.
