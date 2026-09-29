# Stage 2 dispatch — safe booking core

@Architect Extend the existing Tablekeeper slice so the booking core is safe under concurrency and retries. Define the invariant that one physical table cannot be confirmed twice for the same local date and time. Add an idempotency strategy, deterministic conflict behavior, cancellation, and tests that create competing attempts. Hand off the implementation to @Builder and require @Verifier to run the race and retry checks without manual steering.

Done state: the run contains evidence that one concurrent winner is accepted, losing attempts are conflicts, and an identical retry returns the original reservation.
