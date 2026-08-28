import type { Express, Request, Response } from "express";
import { handleTelegramWebhook, listPublishedProducts } from "./telegramAdmin";

const TELEGRAM_API_BASE = "https://api.telegram.org";
const MAX_FIELD_LENGTH = 4000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

type OrderItem = {
  name?: unknown;
  quantity?: unknown;
};

type OrderPayload = {
  customerName?: unknown;
  customerPhone?: unknown;
  organization?: unknown;
  notes?: unknown;
  items?: unknown;
};

export function isTelegramWebhookSecretValid(value: unknown) {
  const configured = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  return Boolean(configured && typeof value === "string" && value.length === configured.length && value === configured);
}

function readTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    throw new Error("Telegram integration is not configured");
  }
  return { token, chatId };
}

function text(value: unknown, fallback = "Ko'rsatilmagan") {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim();
  return normalized ? normalized.slice(0, MAX_FIELD_LENGTH) : fallback;
}

function escapeTelegramHtml(value: string) {
  return value.replace(/[&<>\"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[char] ?? char);
}

function isValidContactPayload(body: ContactPayload) {
  return typeof body.name === "string" &&
    body.name.trim().length >= 2 &&
    body.name.trim().length <= MAX_FIELD_LENGTH &&
    typeof body.email === "string" &&
    body.email.trim().length >= 3 &&
    body.email.trim().length <= MAX_FIELD_LENGTH &&
    typeof body.message === "string" &&
    body.message.trim().length >= 2 &&
    body.message.trim().length <= MAX_FIELD_LENGTH;
}

export function buildContactMessage(body: ContactPayload) {
  return [
    "✉️ <b>Yangi xabar — Contact formasidan</b>",
    "",
    `👤 <b>Ism:</b> ${escapeTelegramHtml(text(body.name))}`,
    `📧 <b>Email:</b> ${escapeTelegramHtml(text(body.email))}`,
    `📝 <b>Xabar:</b> ${escapeTelegramHtml(text(body.message))}`,
  ].join("\n");
}

async function sendTelegramMessage(message: string) {
  const { token, chatId } = readTelegramConfig();
  const response = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { description?: string };
    throw new Error(`Telegram API responded with ${response.status}: ${payload.description || "Unknown Telegram error"}`);
  }
}

function respondWithError(res: Response, error: unknown) {
  console.error("[Telegram] Message delivery failed", error instanceof Error ? error.message : "Unknown error");
  res.status(502).json({ success: false, message: "Xabarni yuborishda muammo yuz berdi." });
}

async function handleContact(req: Request, res: Response) {
  if (!isValidContactPayload(req.body ?? {})) {
    res.status(400).json({ success: false, message: "Ism, email va xabarni to‘liq kiriting." });
    return;
  }

  try {
    await sendTelegramMessage(buildContactMessage(req.body));
    res.json({ success: true });
  } catch (error) {
    respondWithError(res, error);
  }
}

export function buildOrderMessage(body: OrderPayload) {
  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items = rawItems.slice(0, 50).map((item: OrderItem, index) =>
    `${index + 1}. ${escapeTelegramHtml(text(item.name, "Mahsulot"))} (${escapeTelegramHtml(text(item.quantity, "1"))} dona)`
  ).join("\n");

  return [
    "🚀 <b>Yangi so‘rov qabul qilindi</b>",
    "",
    `👤 <b>Mijoz:</b> ${escapeTelegramHtml(text(body.customerName))}`,
    `📞 <b>Telefon:</b> ${escapeTelegramHtml(text(body.customerPhone))}`,
    `🏢 <b>Muassasa:</b> ${escapeTelegramHtml(text(body.organization))}`,
    `📝 <b>Izoh:</b> ${escapeTelegramHtml(text(body.notes))}`,
    "",
    "📦 <b>Mahsulotlar:</b>",
    items || "Ko‘rsatilmagan",
  ].join("\n");
}

async function handleOrder(req: Request, res: Response) {
  try {
    await sendTelegramMessage(buildOrderMessage(req.body ?? {}));
    res.json({ success: true });
  } catch (error) {
    respondWithError(res, error);
  }
}

async function handleTelegramUpdates(_req: Request, res: Response) {
  try {
    const { token } = readTelegramConfig();
    const response = await fetch(`${TELEGRAM_API_BASE}/bot${token}/getUpdates?offset=-100&limit=100`, {
      signal: AbortSignal.timeout(10_000),
    });
    const result = await response.json().catch(() => ({ ok: false, result: [] }));
    res.status(response.ok ? 200 : 502).json(result);
  } catch (error) {
    respondWithError(res, error);
  }
}

export function registerTelegramRoutes(app: Express) {
  app.post("/api/contact", handleContact);
  app.post("/api/order-notification", handleOrder);
  app.get("/api/telegram/updates", handleTelegramUpdates);
  app.get("/api/products/published", listPublishedProducts);
  app.post("/api/telegram/webhook", (req, res) => {
    const secret = req.get("X-Telegram-Bot-Api-Secret-Token");
    if (!isTelegramWebhookSecretValid(secret)) {
      res.status(401).json({ ok: false, message: "Invalid webhook secret." });
      return;
    }
    void handleTelegramWebhook(req, res);
  });
}
