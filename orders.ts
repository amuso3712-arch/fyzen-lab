import type { Express, Request, Response } from "express";
import { desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { orderRequests } from "../drizzle/schema";
import { sdk } from "./_core/sdk";

const MAX_TEXT = 4000;

type OrderItemInput = { name?: unknown; quantity?: unknown };

type OrderPayload = {
  id?: unknown;
  customerName?: unknown;
  customerPhone?: unknown;
  organization?: unknown;
  notes?: unknown;
  items?: unknown;
};

function cleanText(value: unknown, max = MAX_TEXT) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizeItems(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 50).map((item: OrderItemInput) => ({
    id: typeof item?.name === "string" ? item.name.slice(0, 200) : undefined,
    name: cleanText(item?.name, 300) || "Mahsulot",
    quantity: Math.max(1, Math.min(9999, Number(item?.quantity) || 1)),
  }));
}

export function validateOrder(body: OrderPayload) {
  const requestId = cleanText(typeof body.id === "number" ? String(body.id) : body.id, 32);
  const customerName = cleanText(body.customerName, 200);
  const customerPhone = cleanText(body.customerPhone, 80);
  const organization = cleanText(body.organization, 300);
  const notes = cleanText(body.notes, MAX_TEXT);
  const items = normalizeItems(body.items);
  if (requestId.length < 3 || customerName.length < 2 || customerPhone.length < 5 || items.length === 0) return null;
  return { requestId, customerName, customerPhone, organization: organization || null, notes: notes || null, items };
}

const ORDER_STATUSES = ["new", "processing", "completed", "cancelled"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

async function requireAdmin(req: Request) {
  const user = await sdk.authenticateRequest(req);
  if (user.role !== "admin") throw new Error("ADMIN_REQUIRED");
  return user;
}

function serializeOrder(row: typeof orderRequests.$inferSelect) {
  let items: unknown[] = [];
  try {
    const parsed = JSON.parse(row.itemsJson);
    items = Array.isArray(parsed) ? parsed : [];
  } catch {
    items = [];
  }
  return { ...row, items };
}

async function listAdminOrders(req: Request, res: Response) {
  try {
    await requireAdmin(req);
    const db = await getDb();
    if (!db) { res.status(503).json({ success: false, message: "Database unavailable." }); return; }
    const rows = await db.select().from(orderRequests).orderBy(desc(orderRequests.createdAt)).limit(500);
    res.json({ success: true, orders: rows.map(serializeOrder) });
  } catch (error) {
    const isAdminError = error instanceof Error && error.message === "ADMIN_REQUIRED";
    res.status(isAdminError ? 403 : 401).json({ success: false, message: isAdminError ? "Admin access required." : "Authentication required." });
  }
}

async function updateAdminOrderStatus(req: Request, res: Response) {
  try {
    await requireAdmin(req);
    const requestId = cleanText(req.params.requestId, 32);
    const status = cleanText(req.body?.status, 20) as OrderStatus;
    const statusNote = cleanText(req.body?.statusNote, 500);
    if (!requestId || !ORDER_STATUSES.includes(status)) {
      res.status(400).json({ success: false, message: "Invalid order status." });
      return;
    }
    const db = await getDb();
    if (!db) { res.status(503).json({ success: false, message: "Database unavailable." }); return; }
    const existing = await db.select().from(orderRequests).where(eq(orderRequests.requestId, requestId)).limit(1);
    if (!existing[0]) { res.status(404).json({ success: false, message: "Order not found." }); return; }
    await db.update(orderRequests).set({ status, statusNote: statusNote || null }).where(eq(orderRequests.requestId, requestId));
    const rows = await db.select().from(orderRequests).where(eq(orderRequests.requestId, requestId)).limit(1);
    res.json({ success: true, order: rows[0] ? serializeOrder(rows[0]) : null });
  } catch (error) {
    const isAdminError = error instanceof Error && error.message === "ADMIN_REQUIRED";
    res.status(isAdminError ? 403 : 401).json({ success: false, message: isAdminError ? "Admin access required." : "Authentication required." });
  }
}

async function createOrder(req: Request, res: Response) {
  const order = validateOrder(req.body ?? {});
  if (!order) {
    res.status(400).json({ success: false, message: "Mijoz ma'lumotlari va kamida bitta mahsulotni to‘liq kiriting." });
    return;
  }

  const db = await getDb();
  if (!db) {
    res.status(503).json({ success: false, message: "Buyurtma serverda saqlanmadi." });
    return;
  }

  try {
    await db.insert(orderRequests).values({
      requestId: order.requestId,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      organization: order.organization,
      notes: order.notes,
      itemsJson: JSON.stringify(order.items),
    });
    res.status(201).json({ success: true, requestId: order.requestId });
  } catch (error) {
    console.error("[Orders] Failed to save order:", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ success: false, message: "Buyurtma serverda saqlanmadi." });
  }
}

export function registerOrderRoutes(app: Express) {
  app.post("/api/orders", createOrder);
  app.get("/api/admin/orders", listAdminOrders);
  app.patch("/api/admin/orders/:requestId/status", updateAdminOrderStatus);
}
