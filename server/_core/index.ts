import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { engine, restaurants } from "../tablekeeper";

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ limit: "2mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "tablekeeper", timestamp: new Date().toISOString() }));
  app.get("/api/platform/config.js", (_req, res) => res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript()));

  app.get("/api/restaurants", (req, res) => {
    const partySize = Number(req.query.partySize || 2);
    res.json({ restaurants: engine.search({ city: String(req.query.city || ""), cuisine: String(req.query.cuisine || ""), partySize: Number.isFinite(partySize) ? partySize : 2 }) });
  });
  app.get("/api/restaurants/:id/availability", (req, res) => {
    const date = String(req.query.date || new Date().toISOString().slice(0, 10));
    const partySize = Number(req.query.partySize || 2);
    res.json({ restaurant: restaurants.find((r) => r.id === req.params.id) ?? null, slots: engine.availability(req.params.id, date, Number.isFinite(partySize) ? partySize : 2), date });
  });
  app.get("/api/reservations", (req, res) => res.json({ reservations: engine.listReservations(req.query.email ? String(req.query.email) : undefined) }));
  app.post("/api/reservations", (req, res) => {
    const idempotencyKey = String(req.get("Idempotency-Key") || req.body.idempotencyKey || "");
    const replayed = Boolean(engine.findByIdempotency(idempotencyKey));
    const result = engine.reserve({ ...req.body, idempotencyKey });
    if (result.reservation) return res.status(replayed ? 200 : 201).json({ reservation: result.reservation, replayed });
    const status = result.error === "NO_TABLE" ? 409 : 400;
    return res.status(status).json({ error: result.error, message: result.error === "NO_TABLE" ? "That slot just filled up. Pick another time and we’ll keep your evening moving." : "Please check the booking details and try again." });
  });
  app.delete("/api/reservations/:id", (req, res) => {
    const reservation = engine.cancel(req.params.id);
    return reservation ? res.json({ reservation }) : res.status(404).json({ message: "Reservation not found" });
  });

  registerOAuthRoutes(app);
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  if (process.env.NODE_ENV === "development") await setupVite(app, server); else serveStatic(app);
  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", (error) => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Tablekeeper listening on ${port}`));
}
startServer().catch((error) => { console.error(error); process.exit(1); });
