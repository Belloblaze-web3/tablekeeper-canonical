import { describe, expect, it } from "vitest";
import { ReservationEngine } from "../server/tablekeeper";

describe("ReservationEngine", () => {
  it("never double-books a table when concurrent requests race", async () => {
    const engine = new ReservationEngine();
    const attempts = await Promise.all(Array.from({ length: 12 }, (_, index) => Promise.resolve(engine.reserve({ restaurantId: "marlow", date: "2026-10-02", time: "19:00", partySize: 6, guestName: `Guest ${index}`, guestEmail: `guest${index}@example.com`, idempotencyKey: `race-${index}` }))));
    expect(attempts.filter((result) => result.reservation)).toHaveLength(1);
    expect(attempts.filter((result) => result.error === "NO_TABLE")).toHaveLength(11);
  });

  it("replays the original reservation for the same idempotency key", () => {
    const engine = new ReservationEngine();
    const input = { restaurantId: "juniper", date: "2026-10-02", time: "18:30", partySize: 2, guestName: "Morgan Lee", guestEmail: "morgan@example.com", idempotencyKey: "retry-123" };
    const first = engine.reserve(input);
    const second = engine.reserve(input);
    expect(second.reservation?.id).toBe(first.reservation?.id);
    expect(engine.listReservations("avery@example.com")).toHaveLength(1);
  });

  it("releases capacity when a reservation is cancelled", () => {
    const engine = new ReservationEngine();
    const first = engine.reserve({ restaurantId: "saffron", date: "2026-10-02", time: "18:00", partySize: 6, guestName: "Avery Chen", guestEmail: "avery@example.com", idempotencyKey: "cancel-1" });
    expect(first.reservation).toBeDefined();
    expect(engine.cancel(first.reservation!.id)?.status).toBe("cancelled");
    expect(engine.availability("saffron", "2026-10-02", 6).find((slot) => slot.time === "18:00")?.available).toBe(true);
  });

  it("only exposes half-hour slots inside the restaurant's local hours", () => {
    const engine = new ReservationEngine();
    const slots = engine.availability("marlow", "2026-11-01", 2);
    expect(slots[0].time).toBe("17:00");
    expect(slots.at(-1)?.time).toBe("23:00");
    expect(slots.every((slot) => Number(slot.time.split(":")[1]) % 30 === 0)).toBe(true);
  });
});
