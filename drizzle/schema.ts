import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const restaurants = mysqlTable("restaurants", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  neighborhood: varchar("neighborhood", { length: 120 }).notNull(),
  cuisine: varchar("cuisine", { length: 80 }).notNull(),
  timezone: varchar("timezone", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const diningTables = mysqlTable("dining_tables", {
  id: varchar("id", { length: 64 }).primaryKey(),
  restaurantId: varchar("restaurantId", { length: 64 }).notNull(),
  seats: int("seats").notNull(),
  label: varchar("label", { length: 120 }).notNull(),
});

export const reservations = mysqlTable("reservations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  restaurantId: varchar("restaurantId", { length: 64 }).notNull(),
  tableId: varchar("tableId", { length: 64 }).notNull(),
  reservationDate: varchar("reservationDate", { length: 10 }).notNull(),
  reservationTime: varchar("reservationTime", { length: 5 }).notNull(),
  restaurantTimezone: varchar("restaurantTimezone", { length: 64 }).notNull(),
  partySize: int("partySize").notNull(),
  guestName: varchar("guestName", { length: 160 }).notNull(),
  guestEmail: varchar("guestEmail", { length: 320 }).notNull(),
  status: mysqlEnum("status", ["confirmed", "cancelled"]).default("confirmed").notNull(),
  idempotencyKey: varchar("idempotencyKey", { length: 160 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  uniqueBooking: uniqueIndex("unique_live_table_slot").on(table.tableId, table.reservationDate, table.reservationTime, table.status),
  uniqueRetry: uniqueIndex("unique_idempotency_key").on(table.idempotencyKey),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
