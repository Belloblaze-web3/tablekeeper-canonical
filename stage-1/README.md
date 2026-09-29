# Stage 1 — coherent vertical slice

This stage establishes the complete offline reservation journey: seeded restaurant discovery, city/cuisine/party filters, date selection, availability slots, guest details, confirmation, and a health endpoint. The root service is the canonical buildable service; this folder is the stage evidence and acceptance record submitted with it.

**Acceptance:** `pnpm dev`, open `/`, choose a restaurant, select a slot, and confirm a booking. Verify `GET /api/health` returns `status: ok`.

**Evidence:** `client/src/pages/Home.tsx`, `server/_core/index.ts`, `server/tablekeeper.ts`.
