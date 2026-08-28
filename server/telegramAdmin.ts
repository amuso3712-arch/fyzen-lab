import { and, desc, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { productSubmissions, orderRequests, telegramAdminSessions, telegramAdminAuditLogs } from "../drizzle/schema";
import { getDb } from "./db";
import { storagePut } from "./storage";

const DEFAULT_ADMIN_ID = "";
const ADMIN_IDS = new Set([
  ...(process.env.TELEGRAM_ADMIN_IDS || DEFAULT_ADMIN_ID).split(","),
  ...(process.env.TELEGRAM_EXTRA_ADMIN_IDS || "").split(","),
].map(value => value.trim()).filter(Boolean));
const API = "https://api.telegram.org";
const ADMIN_PANEL_URL = process.env.TELEGRAM_ADMIN_PANEL_URL?.trim();
const MINI_APP_URL = process.env.TELEGRAM_MINI_APP_URL?.trim();
const CATEGORIES = ["analytical", "medical", "chemistry", "physics", "biology", "environmental", "agriculture", "industrial", "petroleum", "educational", "furniture", "consumables"];
const STATUSES = ["new", "processing", "completed", "cancelled"] as const;

type TgMessage = { message_id?: number; chat?: { id?: number | string }; from?: { id?: number | string }; text?: string; photo?: Array<{ file_id: string; width?: number; height?: number; file_size?: number }>; caption?: string };
type TgUpdate = { update_id?: number; message?: TgMessage; callback_query?: { id: string; data?: string; from?: { id?: number | string }; message?: TgMessage } };
type SessionPayload = Record<string, string>;

function config() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  return token;
}

export function isTelegramAdmin(id: unknown) { return ADMIN_IDS.has(String(id ?? "")); }
function actorIdForAudit() { return Array.from(ADMIN_IDS)[0] || "unknown"; }

async function tg<T = unknown>(method: string, body: Record<string, unknown>) {
  const response = await fetch(`${API}/bot${config()}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(10000) });
  const json = await response.json().catch(() => ({})) as { ok?: boolean; result?: T; description?: string };
  if (!response.ok || !json.ok) throw new Error(json.description || `Telegram ${method} failed`);
  return json.result as T;
}

function clean(value: unknown, max = 500) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function menu() {
  const rows: Array<Array<Record<string, unknown>>> = [[{ text: "📦 Buyurtmalar", callback_data: "orders" }, { text: "➕ Buyurtma qo‘shish", callback_data: "order:add" }], [{ text: "➕ Mahsulot qo‘shish", callback_data: "product:add" }], [{ text: "🧪 Draft mahsulotlar", callback_data: "products:drafts" }, { text: "🔄 Yangilash", callback_data: "menu" }]];
  if (MINI_APP_URL) rows.splice(1, 0, [{ text: "🚀 Mini Appni ochish", web_app: { url: MINI_APP_URL } }]);
  if (ADMIN_PANEL_URL) rows.splice(2, 0, [{ text: "🌐 Web adminni ochish", url: ADMIN_PANEL_URL }]);
  return { inline_keyboard: rows };
}
async function send(chatId: string | number, text: string, reply_markup?: unknown) { return tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", reply_markup }); }
async function edit(chatId: string | number, messageId: number, text: string, reply_markup?: unknown) { return tg("editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", reply_markup }); }
async function answerCallback(id: string) { await tg("answerCallbackQuery", { callback_query_id: id }); }

async function session(chatId: string) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const rows = await db.select().from(telegramAdminSessions).where(eq(telegramAdminSessions.chatId, chatId)).limit(1);
  return rows[0] ?? { id: 0, chatId, step: "idle", payloadJson: "{}", lastUpdateId: null, updatedAt: new Date() };
}
async function saveSession(chatId: string, step: string, payload: SessionPayload, updateId?: number) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.insert(telegramAdminSessions).values({ chatId, step, payloadJson: JSON.stringify(payload), lastUpdateId: updateId ?? null }).onDuplicateKeyUpdate({ set: { step, payloadJson: JSON.stringify(payload), ...(updateId === undefined ? {} : { lastUpdateId: updateId }) } });
}
function payloadOf(raw: string): SessionPayload { try { const value = JSON.parse(raw); return value && typeof value === "object" ? value : {}; } catch { return {}; } }
async function audit(actorId: string, action: string, targetType: string, targetId: string, before: unknown, after: unknown) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.insert(telegramAdminAuditLogs).values({ actorId, action, targetType, targetId, beforeJson: before == null ? null : JSON.stringify(before), afterJson: after == null ? null : JSON.stringify(after) }); }

async function orders(chatId: string) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const rows = await db.select().from(orderRequests).orderBy(desc(orderRequests.createdAt)).limit(10);
  if (!rows.length) return send(chatId, "📦 <b>Buyurtmalar</b>\n\nHozircha buyurtmalar yo‘q.", menu());
  const text = rows.map((row, i) => `#${i + 1} <b>${row.requestId}</b> — ${row.status}\n👤 ${clean(row.customerName, 120)}\n📞 ${clean(row.customerPhone, 80)}`).join("\n\n");
  const keyboard = rows.map(row => [{ text: `${row.requestId} · ${row.status}`, callback_data: `order:${row.requestId}` }]);
  return send(chatId, `📦 <b>So‘nggi buyurtmalar</b>\n\n${text}`, { inline_keyboard: [...keyboard, [{ text: "⬅️ Menyu", callback_data: "menu" }]] });
}
async function orderDetail(chatId: string, requestId: string) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const row = (await db.select().from(orderRequests).where(eq(orderRequests.requestId, requestId)).limit(1))[0];
  if (!row) return send(chatId, "Buyurtma topilmadi.", menu());
  let items = ""; try { items = (JSON.parse(row.itemsJson) as Array<{ name?: string; quantity?: number }>).map(x => `• ${clean(x.name, 200)} × ${x.quantity || 1}`).join("\n"); } catch { items = row.itemsJson; }
  const buttons = STATUSES.map(status => ({ text: status === row.status ? `✅ ${status}` : status, callback_data: `status:${requestId}:${status}` }));
  return send(chatId, `📦 <b>Buyurtma ${requestId}</b>\n\n👤 ${clean(row.customerName)}\n📞 ${clean(row.customerPhone)}\n🏢 ${clean(row.organization || "—")}\n📝 ${clean(row.notes || "—")}\n\n${items}\n\nHolatni tanlang:`, { inline_keyboard: [buttons, [{ text: "⬅️ Buyurtmalar", callback_data: "orders" }]] });
}
async function setStatus(chatId: string, requestId: string, status: string) {
  if (!STATUSES.includes(status as typeof STATUSES[number])) return;
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const before = (await db.select().from(orderRequests).where(eq(orderRequests.requestId, requestId)).limit(1))[0] || null;
  await db.update(orderRequests).set({ status: status as typeof STATUSES[number] }).where(eq(orderRequests.requestId, requestId));
  const after = (await db.select().from(orderRequests).where(eq(orderRequests.requestId, requestId)).limit(1))[0] || null;
  await audit(String(actorIdForAudit()), "status_update", "order", requestId, before, after);
  await send(chatId, `✅ ${requestId} buyurtmasi holati <b>${status}</b> ga o‘zgartirildi.`, menu());
}

async function drafts(chatId: string) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const rows = await db.select().from(productSubmissions).where(eq(productSubmissions.status, "draft")).orderBy(desc(productSubmissions.createdAt)).limit(10);
  if (!rows.length) return send(chatId, "🧪 Tasdiqlanishi kutilayotgan draftlar yo‘q.", menu());
  return send(chatId, `🧪 <b>Draft mahsulotlar</b>\n\n${rows.map(row => `• <b>${row.name}</b> — ${row.brand} · ${row.category}`).join("\n")}`, { inline_keyboard: [...rows.flatMap(row => [[{ text: `✏️ ${row.name.slice(0, 18)}`, callback_data: `edit:${row.productId}` }, { text: "✅ Tasdiqlash", callback_data: `approve:${row.productId}` }]]), [{ text: "⬅️ Menyu", callback_data: "menu" }]] });
}
async function startEdit(chatId: string, productId: string) { await saveSession(chatId, "edit_field", { productId }); return send(chatId, "✏️ Qaysi maydonni o‘zgartiramiz?", { inline_keyboard: [[{ text: "Nom", callback_data: "editfield:name" }, { text: "Brend", callback_data: "editfield:brand" }], [{ text: "Kategoriya", callback_data: "editfield:category" }, { text: "Narx", callback_data: "editfield:price" }], [{ text: "Tavsif", callback_data: "editfield:description" }, { text: "Bekor qilish", callback_data: "cancel" }]] }); }
async function continueEdit(chatId: string, message: TgMessage, updateId?: number) {
  const current = await session(chatId); const p = payloadOf(current.payloadJson); const value = clean(message.text, 600);
  if (current.step === "edit_field") { return send(chatId, "Maydonni inline tugmalardan tanlang."); }
  if (current.step === "edit_value") {
    const db = await getDb(); if (!db) throw new Error("Database unavailable");
    const field = p.field; const allowed = ["name", "brand", "category", "price", "description"];
    if (!allowed.includes(field) || !p.productId || !value) return send(chatId, "Qiymat bo‘sh bo‘lmasin. Qayta yuboring:");
    const before = (await db.select().from(productSubmissions).where(eq(productSubmissions.productId, p.productId)).limit(1))[0] || null;
    const update: Record<string, string> = field === "name" ? { name: value, nameUz: value, nameRu: value, nameEn: value } : { [field]: value };
    await db.update(productSubmissions).set(update as any).where(and(eq(productSubmissions.productId, p.productId), eq(productSubmissions.status, "draft")));
    const after = (await db.select().from(productSubmissions).where(eq(productSubmissions.productId, p.productId)).limit(1))[0] || null;
    await audit(String(actorIdForAudit()), "edit", "product", p.productId, before, after);
    await saveSession(chatId, "idle", {}); return send(chatId, "✅ Draft yangilandi.", menu());
  }
  return send(chatId, "Tahrirlash yakunlandi.", menu());
}
async function approve(chatId: string, productId: string) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const before = (await db.select().from(productSubmissions).where(eq(productSubmissions.productId, productId)).limit(1))[0] || null;
  await db.update(productSubmissions).set({ status: "approved" }).where(and(eq(productSubmissions.productId, productId), eq(productSubmissions.status, "draft")));
  const after = (await db.select().from(productSubmissions).where(eq(productSubmissions.productId, productId)).limit(1))[0] || null;
  await audit(String(actorIdForAudit()), "approve", "product", productId, before, after);
  await send(chatId, `✅ Mahsulot <b>${productId}</b> tasdiqlandi va public katalogga chiqarishga tayyor.`, menu());
}

async function startOrder(chatId: string) { await saveSession(chatId, "order_name", {}); return send(chatId, "➕ <b>Yangi buyurtma</b>\n\n1/4 Mijoz ismini yuboring:"); }
async function saveOrder(chatId: string) {
  const current = await session(chatId); const p = payloadOf(current.payloadJson); const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const requestId = `tg-${Date.now().toString(36)}`;
  const created = { requestId, customerName: p.customerName || "Telegram mijoz", customerPhone: p.customerPhone || "—", organization: p.organization || null, notes: p.item ? `Telegramdan qo‘shildi: ${p.item}` : null, itemsJson: JSON.stringify([{ name: p.item || "Telegram buyurtmasi", quantity: 1 }]), status: "new" as const };
  await db.insert(orderRequests).values(created);
  await audit(String(actorIdForAudit()), "create", "order", requestId, null, created);
  await saveSession(chatId, "idle", {}); return send(chatId, `✅ Buyurtma saqlandi: <b>${requestId}</b>`, menu());
}
async function continueOrder(chatId: string, message: TgMessage, updateId?: number) {
  const current = await session(chatId); const p = payloadOf(current.payloadJson); const value = clean(message.text, 600);
  if (current.step === "order_name") { p.customerName = value; await saveSession(chatId, "order_phone", p, updateId); return send(chatId, "2/4 Telefon raqamini yuboring:"); }
  if (current.step === "order_phone") { if (value.length < 5) return send(chatId, "Telefon raqami juda qisqa. Qayta yuboring:"); p.customerPhone = value; await saveSession(chatId, "order_org", p, updateId); return send(chatId, "3/4 Tashkilot nomi yoki — yuboring:"); }
  if (current.step === "order_org") { p.organization = value === "—" ? "" : value; await saveSession(chatId, "order_item", p, updateId); return send(chatId, "4/4 Mahsulot nomi va miqdorini yuboring:"); }
  if (current.step === "order_item") { if (!value) return send(chatId, "Mahsulot nomi bo‘sh bo‘lmasin:"); p.item = value; await saveSession(chatId, "order_confirm", p, updateId); return send(chatId, `Tasdiqlang:\n\n👤 ${p.customerName}\n📞 ${p.customerPhone}\n🏢 ${p.organization || "—"}\n📦 ${p.item}`, { inline_keyboard: [[{ text: "✅ Saqlash", callback_data: "order:save" }, { text: "❌ Bekor qilish", callback_data: "cancel" }]] }); }
  return send(chatId, "Tasdiqlash tugmasini bosing.");
}
async function startProduct(chatId: string) { await saveSession(chatId, "name", {}); return send(chatId, "➕ <b>Yangi mahsulot</b>\n\n1/7 Mahsulot nomini yuboring:", { inline_keyboard: [[{ text: "Bekor qilish", callback_data: "cancel" }]] }); }
async function continueProduct(chatId: string, message: TgMessage, updateId?: number) {
  const current = await session(chatId); const p = payloadOf(current.payloadJson); const value = clean(message.text || message.caption, 600);
  if (current.step === "name") { if (!value) return send(chatId, "Nom bo‘sh bo‘lmasin. Qayta yuboring:"); p.name = value; await saveSession(chatId, "brand", p, updateId); return send(chatId, "2/7 Brend nomini yuboring:"); }
  if (current.step === "brand") { p.brand = value; await saveSession(chatId, "category", p, updateId); return send(chatId, `3/7 Kategoriya yuboring:\n${CATEGORIES.join(", ")}`); }
  if (current.step === "category") { if (!CATEGORIES.includes(value.toLowerCase())) return send(chatId, `Kategoriya ro‘yxatdan tanlansin: ${CATEGORIES.join(", ")}`); p.category = value.toLowerCase(); await saveSession(chatId, "price", p, updateId); return send(chatId, "4/7 Narxni yuboring yoki Request deb yozing:"); }
  if (current.step === "price") { p.price = value || "Request"; await saveSession(chatId, "description", p, updateId); return send(chatId, "5/7 Qisqa tavsif yuboring:"); }
  if (current.step === "description") { p.description = value; await saveSession(chatId, "photo", p, updateId); return send(chatId, "6/7 Mahsulot fotosini yuboring:"); }
  if (current.step === "photo") {
    const photo = message.photo?.at(-1); if (!photo) return send(chatId, "Iltimos, mahsulot fotosini yuboring:");
    if (photo.file_size && photo.file_size > 8 * 1024 * 1024) return send(chatId, "Rasm 8 MB dan kichik bo‘lsin. Iltimos, kichikroq JPG/PNG yuboring:");
    try {
      const file = await tg<{ file_path?: string }>("getFile", { file_id: photo.file_id }); if (!file?.file_path) throw new Error("Telegram photo path missing");
      const download = await fetch(`${API}/file/bot${config()}/${file.file_path}`); if (!download.ok) throw new Error("Telegram photo download failed");
      const bytes = Buffer.from(await download.arrayBuffer()); if (bytes.length > 8 * 1024 * 1024) return send(chatId, "Rasm hajmi 8 MB dan katta. Iltimos, kichikroq rasm yuboring:");
      const uploaded = await storagePut(`products/${p.name || "product"}.jpg`, bytes, "image/jpeg"); p.imageUrl = uploaded.url;
    } catch (error) { console.error("[Telegram admin] product photo handling failed", error); return send(chatId, "Rasmni saqlashda muammo yuz berdi. Iltimos, JPG yoki PNG rasmni qayta yuboring:"); }
    await saveSession(chatId, "confirm", p, updateId); return send(chatId, `7/7 Tekshiring:\n\n<b>${p.name}</b>\nBrend: ${p.brand}\nKategoriya: ${p.category}\nNarx: ${p.price}\nTavsif: ${p.description}\n\nSaqlaymizmi?`, { inline_keyboard: [[{ text: "✅ Draftga saqlash", callback_data: "product:save" }, { text: "❌ Bekor qilish", callback_data: "cancel" }]] });
  }
  if (current.step === "confirm") return send(chatId, "Tasdiqlash tugmasini bosing.");
  return send(chatId, "Menyu ochildi.", menu());
}
async function saveProduct(chatId: string) {
  const current = await session(chatId); const p = payloadOf(current.payloadJson); const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const productId = `bot-${Date.now().toString(36)}`;
  await db.insert(productSubmissions).values({ productId, name: p.name, nameUz: p.name, nameRu: p.name, nameEn: p.name, brand: p.brand, category: p.category, price: p.price || "Request", description: p.description || null, imageUrl: p.imageUrl || null, status: "draft", createdBy: actorIdForAudit() });
  await saveSession(chatId, "idle", {}); return send(chatId, `✅ Draft saqlandi: <b>${productId}</b>\nPublic katalogga chiqarishdan oldin Draft mahsulotlar bo‘limida tasdiqlang.`, menu());
}

export async function handleTelegramAdminUpdate(update: TgUpdate) {
  const message = update.message || update.callback_query?.message; const actor = update.message?.from?.id ?? update.callback_query?.from?.id;
  if (!message?.chat?.id) return;
  const chatId = String(message.chat.id);
  if (!isTelegramAdmin(actor)) {
    if (actor !== undefined) await send(chatId, `⛔ Admin ruxsati yo‘q. Sizning Telegram ID’ingiz: <code>${String(actor).replace(/[^0-9-]/g, "")}</code>\n\nShu raqamni loyiha adminiga yuboring.`);
    return;
  } const updateId = update.update_id;
  const current = await session(chatId); if (updateId !== undefined && current.lastUpdateId !== null && updateId <= current.lastUpdateId) return;
  if (update.callback_query) {
    await answerCallback(update.callback_query.id); const data = update.callback_query.data || "";
    if (data === "menu") return send(chatId, "🔐 <b>Fyzen Lab Admin</b>\nTelegram orqali boshqaruv paneli.", menu());
      if (data === "orders") return orders(chatId); if (data === "order:add") return startOrder(chatId); if (data === "order:save") return saveOrder(chatId); if (data === "products:drafts") return drafts(chatId); if (data === "product:add") return startProduct(chatId); if (data === "product:save") return saveProduct(chatId); if (data.startsWith("editfield:")) { const current = await session(chatId); const p = payloadOf(current.payloadJson); p.field = data.slice(10); await saveSession(chatId, "edit_value", p); return send(chatId, "Yangi qiymatni yuboring:"); } if (data.startsWith("edit:")) return startEdit(chatId, data.slice(5)); if (data === "cancel") { await saveSession(chatId, "idle", {}); return send(chatId, "Bekor qilindi.", menu()); }
    if (data.startsWith("order:")) return orderDetail(chatId, data.slice(6)); if (data.startsWith("status:")) { const [, id, status] = data.split(":"); return setStatus(chatId, id, status); } if (data.startsWith("approve:")) return approve(chatId, data.slice(8));
  }
  if (message.text === "/start" || message.text === "/admin") return send(chatId, "🔐 <b>Fyzen Lab Admin</b>\nBuyurtmalar va mahsulotlarni shu bot orqali boshqaring.", menu());
  const activeStep = (await session(chatId)).step;
  if (activeStep.startsWith("order_")) return continueOrder(chatId, message, updateId);
  if (activeStep.startsWith("edit_")) return continueEdit(chatId, message, updateId);
  return continueProduct(chatId, message, updateId);
}

export async function handleTelegramWebhook(req: Request, res: Response) { try { await handleTelegramAdminUpdate(req.body as TgUpdate); res.status(200).json({ ok: true }); } catch (error) { console.error("[Telegram admin] webhook failed", error); res.status(200).json({ ok: false }); } }

export async function listPublishedProducts(_req: Request, res: Response) {
  try {
    const db = await getDb(); if (!db) { res.status(503).json({ success: false, products: [] }); return; }
    const rows = await db.select().from(productSubmissions).where(eq(productSubmissions.status, "approved")).orderBy(desc(productSubmissions.createdAt)).limit(500);
    res.json({ success: true, products: rows.map(row => ({ id: row.productId, name: row.name, name_uz: row.nameUz || row.name, name_ru: row.nameRu || row.name, name_en: row.nameEn || row.name, brand: row.brand, category: row.category, price: row.price || "Request", desc: row.description || "", img: row.imageUrl || "/manus-storage/fyzen-cube-final_9ae90e1b.png", stock: 1, botManaged: true })) });
  } catch (error) { console.error("[Products] failed to list published products", error); res.status(500).json({ success: false, products: [] }); }
}
