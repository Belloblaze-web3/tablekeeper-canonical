# tablekeeper

**A clean-room restaurant reservation clone built as an AI dark factory.**

Tablekeeper helps guests find a neighborhood restaurant and keep a table without double bookings. It is the submission project for the WeAreDevelopers × BAND Dark Factory hackathon, targeting the tablekeeper track.

## Run it

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm dev
```

Open `http://localhost:3000`. The service is offline-friendly and seeds its demo data in memory. `GET /api/health` is the readiness check.

## Build it

```bash
pnpm build
PORT=3000 pnpm start
```

The supplied `Dockerfile` performs the same production build in a clean Node 22 container. No outbound network is required at runtime.

## Correctness claim

The reservation core uses a single check-and-insert critical section in the deterministic demo engine. It returns one winner under a race for the same table slot, returns the original reservation for an identical idempotency key, and makes cancellation idempotent. The production schema adds unique indexes for the table/date/time/status and idempotency key; `FACTORY.md` describes the transaction boundary for a managed MySQL deployment.

## BAND factory

Read `FACTORY.md` for the assembly-line room design, handoff evidence contract, measured result, cost, and limitations. The generic seat mandates are in `band/mandates/`. Track-specific work belongs only in `band/prompts/`.

## Submission map

| Item | Location |
|---|---|
| Design brief | `ideas.md` |
| Implementation plan | `plan.md` |
| Factory description | `FACTORY.md` |
| Generic mandates | `band/mandates/` |
| Stage dispatch prompts | `band/prompts/` |
| Stage evidence | `stage-1/` through `stage-4/` |
| Domain tests | `tests/tablekeeper.test.ts` |
| Room route manifest | `client/public/manus-routes.json` |
