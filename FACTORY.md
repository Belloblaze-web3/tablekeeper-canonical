# Tablekeeper factory

## What this is

Tablekeeper was designed for the WeAreDevelopers × BAND Dark Factory hackathon. The factory is an assembly line of coding-agent seats in BAND Desktop: an architect owns the room and plan, a builder implements bounded work, a verifier runs checks and challenges the result, and a release steward packages evidence. The seats use generic mandates; the tablekeeper-specific details live in the stage dispatch prompts.

## BAND setup

The official docs describe four useful concepts: an account, a peer/session, a host session, and a room. Start BAND Desktop, complete the Claude Code readiness checks, then open an architect host session and run `/jam` followed by `Start a Band Desktop session as the architect for this project.` Create one room for this repository and add the other seats from separate Claude Code sessions. The room export and screen recording belong in the submission evidence.

For SDK-connected seats, create remote agents in `app.band.ai/agents`, copy each API key once, keep credentials in `agent_config.yaml`, and install only the adapter needed by that seat. Example setup:

```bash
uv add "band-sdk[claude-sdk]"
# Keep BAND_REST_URL, BAND_WS_URL, provider keys, and agent_config.yaml out of git.
```

BAND routes messages through @mentions. The room uses an assembly line: each seat mentions the next seat after it posts an artifact and an explicit handoff. A verifier can use a critic overlay by being mentioned on each verdict. The task pasted into the room is the only human input for each stage run; do not steer, approve, or rerun during the captured run.

## Seats and handoffs

| Seat | Owns | Produces | Hands off to |
|---|---|---|---|
| Architect | scope, stage brief, acceptance matrix | `PLAN.md`, work split, risk register | Builder |
| Builder | implementation and local checks | changed files, commands, concise summary | Verifier |
| Verifier | adversarial checks, regression review | `VERIFY.md`, failing evidence or pass verdict | Release steward |
| Release steward | packaging and reproducibility | `FACTORY.md`, stage evidence, clean-run instructions | Architect / human |

Every handoff must include: work item ID, files changed, commands run, observed result, unresolved risks, and the next seat's explicit action. A seat rejects a handoff when evidence is missing or the claim cannot be reproduced.

## Stage dispatch

Use the prompts in `band/prompts/`. Dispatch one prompt per stage to the same room. Start with stage 1 and only move forward when the verifier records a pass. The product brief can mention Tablekeeper, restaurants, endpoints, fields, and concurrency; the standing mandates cannot.

## Evidence and result

The result is the repository plus the BAND room export, the run that produced it, and the running service. The repository contains `stage-1/` through `stage-4/` notes, the domain tests, the clean-container Dockerfile, and the production schema. The main measured result for this submission is the domain suite: twelve concurrent six-person attempts yield one confirmed reservation and eleven conflicts; repeated idempotency keys yield one reservation; cancellation releases capacity.

## Cost and limitation

The demo engine runs without outbound network or a paid provider, so its measured application run cost is $0. BAND/model cost depends on the configured seat runtime and provider credits. The in-memory engine is intentionally deterministic for the clean-room demo. Production deployment should use the Drizzle/MySQL schema and transaction boundary described in `drizzle/schema.ts`; this repo does not claim to provision a live restaurant data feed, payment flow, staff console, or real notification provider.

## Case-study permission

A public case study may describe the task, band, key design decision, verified result, cost, and limitation only with the team's permission.
