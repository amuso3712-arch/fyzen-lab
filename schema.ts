import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const orderRequests = mysqlTable("order_requests", {
  id: int("id").autoincrement().primaryKey(),
  requestId: varchar("requestId", { length: 32 }).notNull().unique(),
  customerName: varchar("customerName", { length: 200 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 80 }).notNull(),
  organization: varchar("organization", { length: 300 }),
  notes: text("notes"),
  itemsJson: text("itemsJson").notNull(),
  status: mysqlEnum("status", ["new", "processing", "completed", "cancelled"]).default("new").notNull(),
  statusNote: varchar("statusNote", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OrderRequest = typeof orderRequests.$inferSelect;
export type InsertOrderRequest = typeof orderRequests.$inferInsert;

export const productSubmissions = mysqlTable("product_submissions", {
  id: int("id").autoincrement().primaryKey(),
  productId: varchar("productId", { length: 40 }).notNull().unique(),
  name: varchar("name", { length: 240 }).notNull(),
  nameUz: varchar("nameUz", { length: 240 }),
  nameRu: varchar("nameRu", { length: 240 }),
  nameEn: varchar("nameEn", { length: 240 }),
  brand: varchar("brand", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  price: varchar("price", { length: 80 }),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 600 }),
  status: mysqlEnum("status", ["draft", "approved", "rejected"]).default("draft").notNull(),
  createdBy: varchar("createdBy", { length: 80 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductSubmission = typeof productSubmissions.$inferSelect;
export type InsertProductSubmission = typeof productSubmissions.$inferInsert;

export const telegramAdminSessions = mysqlTable("telegram_admin_sessions", {
  id: int("id").autoincrement().primaryKey(),
  chatId: varchar("chatId", { length: 80 }).notNull().unique(),
  step: varchar("step", { length: 40 }).notNull().default("idle"),
  payloadJson: text("payloadJson").notNull().default("{}"),
  lastUpdateId: int("lastUpdateId"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TelegramAdminSession = typeof telegramAdminSessions.$inferSelect;
export type InsertTelegramAdminSession = typeof telegramAdminSessions.$inferInsert;

export const telegramAdminAuditLogs = mysqlTable("telegram_admin_audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  actorId: varchar("actorId", { length: 80 }).notNull(),
  action: varchar("action", { length: 80 }).notNull(),
  targetType: varchar("targetType", { length: 40 }).notNull(),
  targetId: varchar("targetId", { length: 80 }).notNull(),
  beforeJson: text("beforeJson"),
  afterJson: text("afterJson"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TelegramAdminAuditLog = typeof telegramAdminAuditLogs.$inferSelect;

export const brandSubmissions = mysqlTable("brand_submissions", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  logoUrl: varchar("logoUrl", { length: 600 }),
  websiteUrl: varchar("websiteUrl", { length: 600 }),
  specialtyEn: varchar("specialtyEn", { length: 300 }),
  specialtyUz: varchar("specialtyUz", { length: 300 }),
  specialtyRu: varchar("specialtyRu", { length: 300 }),
  descriptionEn: text("descriptionEn"),
  descriptionUz: text("descriptionUz"),
  descriptionRu: text("descriptionRu"),
  status: mysqlEnum("status", ["draft", "approved", "rejected"]).default("draft").notNull(),
  createdBy: varchar("createdBy", { length: 80 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BrandSubmission = typeof brandSubmissions.$inferSelect;
export type InsertBrandSubmission = typeof brandSubmissions.$inferInsert;

export const newsSubmissions = mysqlTable("news_submissions", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  titleEn: varchar("titleEn", { length: 240 }).notNull(),
  titleUz: varchar("titleUz", { length: 240 }).notNull(),
  titleRu: varchar("titleRu", { length: 240 }).notNull(),
  excerptEn: text("excerptEn"),
  excerptUz: text("excerptUz"),
  excerptRu: text("excerptRu"),
  contentEn: text("contentEn"),
  contentUz: text("contentUz"),
  contentRu: text("contentRu"),
  imageUrl: varchar("imageUrl", { length: 600 }),
  publishedAt: timestamp("publishedAt"),
  status: mysqlEnum("status", ["draft", "approved", "rejected"]).default("draft").notNull(),
  createdBy: varchar("createdBy", { length: 80 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsSubmission = typeof newsSubmissions.$inferSelect;
export type InsertNewsSubmission = typeof newsSubmissions.$inferInsert;

// TODO: Add your tables here
