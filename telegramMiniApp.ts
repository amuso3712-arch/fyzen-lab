import type { Express, Request, Response } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { isTelegramAdmin } from "./telegramAdmin";
import { brandSubmissions, newsSubmissions, orderRequests, productSubmissions } from "../drizzle/schema";

const MAX_INIT_AGE_SECONDS = 24 * 60 * 60;
const STATUSES = ["new", "processing", "completed", "cancelled"] as const;
const CATEGORIES = new Set(["analytical", "medical", "chemistry", "physics", "biology", "environmental", "agriculture", "industrial", "petroleum", "educational", "furniture", "consumables"]);

type TelegramWebAppUser = { id: number; first_name?: string; last_name?: string; username?: string };

function botToken() { return process.env.TELEGRAM_BOT_TOKEN?.trim() || ""; }
function clean(value: unknown, max = 600) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }

export function validateTelegramWebAppInitData(initData: string, nowSeconds = Math.floor(Date.now() / 1000)): TelegramWebAppUser | null {
  const token = botToken();
  if (!token || !initData) return null;
  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");
  const authDate = Number(params.get("auth_date") || 0);
  const userRaw = params.get("user");
  if (!receivedHash || !authDate || !userRaw || nowSeconds - authDate > MAX_INIT_AGE_SECONDS || authDate - nowSeconds > 60) return null;
  const pairs = Array.from(params.entries()).filter(([key]) => key !== "hash").sort(([a], [b]) => a.localeCompare(b));
  const dataCheckString = pairs.map(([key, value]) => `${key}=${value}`).join("\n");
  const secretKey = createHmac("sha256", token).update("WebAppData").digest();
  const calculated = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  const a = Buffer.from(calculated, "hex"); const b = Buffer.from(receivedHash, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const user = JSON.parse(userRaw) as TelegramWebAppUser;
    return Number.isInteger(user.id) && user.id > 0 ? user : null;
  } catch { return null; }
}

function getAdmin(req: Request) {
  const user = validateTelegramWebAppInitData(req.get("X-Telegram-Init-Data") || "");
  return user && isTelegramAdmin(user.id) ? user : null;
}
function deny(res: Response) { res.status(403).json({ success: false, message: "Telegram admin access required." }); }
function serializeOrder(row: typeof orderRequests.$inferSelect) {
  let items: unknown[] = []; try { const parsed = JSON.parse(row.itemsJson); items = Array.isArray(parsed) ? parsed : []; } catch { /* keep empty */ }
  return { ...row, items };
}
function serializeProduct(row: typeof productSubmissions.$inferSelect) { return { ...row }; }
function serializeNews(row: typeof newsSubmissions.$inferSelect) {
  return { id: row.id, slug: row.slug, title: { en: row.titleEn, uz: row.titleUz, ru: row.titleRu }, excerpt: { en: row.excerptEn || "", uz: row.excerptUz || "", ru: row.excerptRu || "" }, content: { en: row.contentEn || "", uz: row.contentUz || "", ru: row.contentRu || "" }, imageUrl: row.imageUrl, publishedAt: row.publishedAt, status: row.status, createdBy: row.createdBy, createdAt: row.createdAt, updatedAt: row.updatedAt };
}
function serializeBrand(row: typeof brandSubmissions.$inferSelect) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    logoUrl: row.logoUrl,
    websiteUrl: row.websiteUrl,
    specialty: { en: row.specialtyEn || "", uz: row.specialtyUz || "", ru: row.specialtyRu || "" },
    description: { en: row.descriptionEn || "", uz: row.descriptionUz || "", ru: row.descriptionRu || "" },
    status: row.status,
    createdBy: row.createdBy,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
function slugifyBrand(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 170);
}
function safeUrl(value: unknown, max = 600) {
  const raw = clean(value, max);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return ["https:", "http:"].includes(url.protocol) ? url.toString() : null;
  } catch { return null; }
}

async function auth(req: Request, res: Response) {
  const user = getAdmin(req); if (!user) { deny(res); return null; }
  return user;
}
async function listOrders(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const rows = await db.select().from(orderRequests).orderBy(desc(orderRequests.createdAt)).limit(200);
  res.json({ success: true, orders: rows.map(serializeOrder) });
}
async function updateOrder(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const requestId = clean(req.params.requestId, 40); const status = clean(req.body?.status, 20);
  if (!requestId || !STATUSES.includes(status as typeof STATUSES[number])) return res.status(400).json({ success: false, message: "Invalid order status." });
  const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const existing = await db.select().from(orderRequests).where(eq(orderRequests.requestId, requestId)).limit(1);
  if (!existing[0]) return res.status(404).json({ success: false, message: "Order not found." });
  await db.update(orderRequests).set({ status: status as typeof STATUSES[number], statusNote: clean(req.body?.statusNote, 500) || null }).where(eq(orderRequests.requestId, requestId));
  const updated = await db.select().from(orderRequests).where(eq(orderRequests.requestId, requestId)).limit(1);
  res.json({ success: true, order: updated[0] ? serializeOrder(updated[0]) : null });
}
async function listProducts(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const status = clean(req.query.status, 20);
  const rows = await db.select().from(productSubmissions).orderBy(desc(productSubmissions.createdAt)).limit(300);
  res.json({ success: true, products: rows.filter(row => !status || row.status === status).map(serializeProduct) });
}
async function createProduct(req: Request, res: Response) {
  const user = await auth(req, res); if (!user) return;
  const name = clean(req.body?.name, 240); const brand = clean(req.body?.brand, 160); const category = clean(req.body?.category, 80); const price = clean(req.body?.price, 80); const description = clean(req.body?.description, 1200);
  if (name.length < 2 || brand.length < 2 || !CATEGORIES.has(category)) return res.status(400).json({ success: false, message: "Name, brand va valid category kerak." });
  const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const productId = `mini-${Date.now().toString(36)}`;
  await db.insert(productSubmissions).values({ productId, name, nameUz: name, nameRu: name, nameEn: name, brand, category, price: price || "Request", description: description || null, imageUrl: null, status: "draft", createdBy: String(user.id) });
  res.status(201).json({ success: true, productId });
}
async function updateProduct(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const productId = clean(req.params.productId, 40); const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const existing = await db.select().from(productSubmissions).where(eq(productSubmissions.productId, productId)).limit(1);
  if (!existing[0]) return res.status(404).json({ success: false, message: "Product not found." });
  const patch: Record<string, string | null> = {};
  for (const key of ["name", "brand", "category", "price", "description"] as const) if (req.body?.[key] !== undefined) patch[key] = clean(req.body[key], key === "description" ? 1200 : 240) || null;
  if (req.body?.imageUrl !== undefined) { const value = safeUrl(req.body.imageUrl); if (req.body.imageUrl && !value) return res.status(400).json({ success: false, message: "Image URL http yoki https bilan boshlanishi kerak." }); patch.imageUrl = value; }
  if (patch.name !== undefined && !patch.name) return res.status(400).json({ success: false, message: "Product nomi bo‘sh bo‘lmasin." });
  if (patch.brand !== undefined && !patch.brand) return res.status(400).json({ success: false, message: "Brand nomi bo‘sh bo‘lmasin." });
  if (patch.category && !CATEGORIES.has(patch.category)) return res.status(400).json({ success: false, message: "Invalid category." });
  await db.update(productSubmissions).set(patch as any).where(eq(productSubmissions.productId, productId));
  res.json({ success: true });
}
async function listBrands(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const rows = await db.select().from(brandSubmissions).orderBy(desc(brandSubmissions.createdAt)).limit(300);
  res.json({ success: true, brands: rows.map(serializeBrand) });
}

async function createBrand(req: Request, res: Response) {
  const user = await auth(req, res); if (!user) return;
  const name = clean(req.body?.name, 160);
  const slug = slugifyBrand(name);
  if (name.length < 2 || slug.length < 2) return res.status(400).json({ success: false, message: "Brand nomi kamida 2 ta belgidan iborat bo‘lishi kerak." });
  const logoUrl = safeUrl(req.body?.logoUrl);
  const websiteUrl = safeUrl(req.body?.websiteUrl);
  if (req.body?.logoUrl && !logoUrl) return res.status(400).json({ success: false, message: "Logo URL http yoki https bilan boshlanishi kerak." });
  if (req.body?.websiteUrl && !websiteUrl) return res.status(400).json({ success: false, message: "Website URL http yoki https bilan boshlanishi kerak." });
  const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const existing = await db.select().from(brandSubmissions).where(eq(brandSubmissions.slug, slug)).limit(1);
  if (existing[0]) return res.status(409).json({ success: false, message: "Bu brand allaqachon mavjud." });
  const row = {
    slug, name, logoUrl, websiteUrl,
    specialtyEn: clean(req.body?.specialtyEn, 300) || null,
    specialtyUz: clean(req.body?.specialtyUz, 300) || null,
    specialtyRu: clean(req.body?.specialtyRu, 300) || null,
    descriptionEn: clean(req.body?.descriptionEn, 1200) || null,
    descriptionUz: clean(req.body?.descriptionUz, 1200) || null,
    descriptionRu: clean(req.body?.descriptionRu, 1200) || null,
    status: "draft" as const,
    createdBy: String(user.id),
  };
  await db.insert(brandSubmissions).values(row);
  const created = await db.select().from(brandSubmissions).where(eq(brandSubmissions.slug, slug)).limit(1);
  res.status(201).json({ success: true, brand: created[0] ? serializeBrand(created[0]) : null });
}

async function updateBrand(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const slug = clean(req.params.slug, 180); const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const existing = await db.select().from(brandSubmissions).where(eq(brandSubmissions.slug, slug)).limit(1);
  if (!existing[0]) return res.status(404).json({ success: false, message: "Brand topilmadi." });
  const patch: Record<string, string | null> = {};
  for (const key of ["name", "specialtyEn", "specialtyUz", "specialtyRu", "descriptionEn", "descriptionUz", "descriptionRu"] as const) if (req.body?.[key] !== undefined) patch[key] = clean(req.body[key], key.startsWith("description") ? 1200 : key === "name" ? 160 : 300) || null;
  if (req.body?.logoUrl !== undefined) { const value = safeUrl(req.body.logoUrl); if (req.body.logoUrl && !value) return res.status(400).json({ success: false, message: "Logo URL http yoki https bilan boshlanishi kerak." }); patch.logoUrl = value; }
  if (req.body?.websiteUrl !== undefined) { const value = safeUrl(req.body.websiteUrl); if (req.body.websiteUrl && !value) return res.status(400).json({ success: false, message: "Website URL http yoki https bilan boshlanishi kerak." }); patch.websiteUrl = value; }
  if (patch.name !== undefined && (!patch.name || patch.name.length < 2)) return res.status(400).json({ success: false, message: "Brand nomi bo‘sh bo‘lmasin." });
  await db.update(brandSubmissions).set(patch as any).where(eq(brandSubmissions.slug, slug));
  res.json({ success: true });
}

async function deleteBrand(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const slug = clean(req.params.slug, 180); const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const existing = await db.select().from(brandSubmissions).where(eq(brandSubmissions.slug, slug)).limit(1);
  if (!existing[0]) return res.status(404).json({ success: false, message: "Brand topilmadi." });
  await db.delete(brandSubmissions).where(eq(brandSubmissions.slug, slug));
  res.json({ success: true });
}

async function approveBrand(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const slug = clean(req.params.slug, 180); const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const existing = await db.select().from(brandSubmissions).where(eq(brandSubmissions.slug, slug)).limit(1);
  if (!existing[0]) return res.status(404).json({ success: false, message: "Brand topilmadi." });
  await db.update(brandSubmissions).set({ status: "approved" }).where(eq(brandSubmissions.slug, slug));
  res.json({ success: true });
}

async function listNews(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const rows = await db.select().from(newsSubmissions).orderBy(desc(newsSubmissions.createdAt)).limit(300);
  res.json({ success: true, news: rows.map(serializeNews) });
}

function newsSlug(value: string) { return slugifyBrand(value) || `news-${Date.now().toString(36)}`; }
async function createNews(req: Request, res: Response) {
  const user = await auth(req, res); if (!user) return;
  const titleEn = clean(req.body?.titleEn, 240); const titleUz = clean(req.body?.titleUz, 240); const titleRu = clean(req.body?.titleRu, 240);
  if (!titleEn || !titleUz || !titleRu) return res.status(400).json({ success: false, message: "Yangilik sarlavhasi UZ, RU va EN tillarida kerak." });
  const slug = newsSlug(titleEn); const imageUrl = safeUrl(req.body?.imageUrl);
  if (req.body?.imageUrl && !imageUrl) return res.status(400).json({ success: false, message: "Image URL http yoki https bilan boshlanishi kerak." });
  const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  if ((await db.select().from(newsSubmissions).where(eq(newsSubmissions.slug, slug)).limit(1))[0]) return res.status(409).json({ success: false, message: "Bu yangilik allaqachon mavjud." });
  await db.insert(newsSubmissions).values({ slug, titleEn, titleUz, titleRu, excerptEn: clean(req.body?.excerptEn, 1200) || null, excerptUz: clean(req.body?.excerptUz, 1200) || null, excerptRu: clean(req.body?.excerptRu, 1200) || null, contentEn: clean(req.body?.contentEn, 6000) || null, contentUz: clean(req.body?.contentUz, 6000) || null, contentRu: clean(req.body?.contentRu, 6000) || null, imageUrl, status: "draft", createdBy: String(user.id) });
  res.status(201).json({ success: true, slug });
}
async function updateNews(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const slug = clean(req.params.slug, 180); const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const existing = await db.select().from(newsSubmissions).where(eq(newsSubmissions.slug, slug)).limit(1); if (!existing[0]) return res.status(404).json({ success: false, message: "Yangilik topilmadi." });
  const patch: Record<string, string | null> = {};
  for (const key of ["titleEn", "titleUz", "titleRu", "excerptEn", "excerptUz", "excerptRu", "contentEn", "contentUz", "contentRu"] as const) if (req.body?.[key] !== undefined) patch[key] = clean(req.body[key], key.startsWith("content") ? 6000 : key.startsWith("excerpt") ? 1200 : 240) || null;
  if (req.body?.imageUrl !== undefined) { const value = safeUrl(req.body.imageUrl); if (req.body.imageUrl && !value) return res.status(400).json({ success: false, message: "Image URL http yoki https bilan boshlanishi kerak." }); patch.imageUrl = value; }
  for (const key of ["titleEn", "titleUz", "titleRu"] as const) if (patch[key] !== undefined && !patch[key]) return res.status(400).json({ success: false, message: "Yangilik sarlavhasi UZ, RU va EN tillarida bo‘sh bo‘lmasin." });
  await db.update(newsSubmissions).set(patch as any).where(eq(newsSubmissions.slug, slug)); res.json({ success: true });
}
async function approveNews(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const slug = clean(req.params.slug, 180); const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const existing = await db.select().from(newsSubmissions).where(eq(newsSubmissions.slug, slug)).limit(1); if (!existing[0]) return res.status(404).json({ success: false, message: "Yangilik topilmadi." });
  await db.update(newsSubmissions).set({ status: "approved", publishedAt: new Date() }).where(eq(newsSubmissions.slug, slug)); res.json({ success: true });
}
async function deleteNews(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const slug = clean(req.params.slug, 180); const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const existing = await db.select().from(newsSubmissions).where(eq(newsSubmissions.slug, slug)).limit(1); if (!existing[0]) return res.status(404).json({ success: false, message: "Yangilik topilmadi." });
  await db.delete(newsSubmissions).where(eq(newsSubmissions.slug, slug)); res.json({ success: true });
}
async function listPublishedNews(_req: Request, res: Response) {
  const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const rows = await db.select().from(newsSubmissions).where(eq(newsSubmissions.status, "approved")).orderBy(desc(newsSubmissions.publishedAt), desc(newsSubmissions.createdAt)).limit(100);
  res.json({ success: true, news: rows.map(serializeNews) });
}

async function listPublishedBrands(_req: Request, res: Response) {
  const db = await getDb();
  if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const rows = await db.select().from(brandSubmissions).where(eq(brandSubmissions.status, "approved")).orderBy(desc(brandSubmissions.createdAt)).limit(300);
  res.json({ success: true, brands: rows.map(serializeBrand) });
}

async function deleteProduct(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const productId = clean(req.params.productId, 40); const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const existing = await db.select().from(productSubmissions).where(eq(productSubmissions.productId, productId)).limit(1);
  if (!existing[0]) return res.status(404).json({ success: false, message: "Product not found." });
  await db.delete(productSubmissions).where(eq(productSubmissions.productId, productId));
  res.json({ success: true });
}

async function approveProduct(req: Request, res: Response) {
  if (!await auth(req, res)) return;
  const productId = clean(req.params.productId, 40); const db = await getDb(); if (!db) return res.status(503).json({ success: false, message: "Database unavailable." });
  const existing = await db.select().from(productSubmissions).where(eq(productSubmissions.productId, productId)).limit(1);
  if (!existing[0]) return res.status(404).json({ success: false, message: "Product not found." });
  await db.update(productSubmissions).set({ status: "approved" }).where(eq(productSubmissions.productId, productId));
  res.json({ success: true });
}

export function registerTelegramMiniAppRoutes(app: Express) {
  app.post("/api/telegram/miniapp/auth", (req, res) => {
    const user = validateTelegramWebAppInitData(clean(req.body?.initData, 10_000));
    if (!user || !isTelegramAdmin(user.id)) return deny(res);
    res.json({ success: true, user: { id: user.id, name: [user.first_name, user.last_name].filter(Boolean).join(" "), username: user.username || "" } });
  });
  app.get("/api/telegram/miniapp/orders", listOrders);
  app.patch("/api/telegram/miniapp/orders/:requestId/status", updateOrder);
  app.get("/api/telegram/miniapp/products", listProducts);
  app.get("/api/telegram/miniapp/brands", listBrands);
  app.post("/api/telegram/miniapp/brands", createBrand);
  app.patch("/api/telegram/miniapp/brands/:slug", updateBrand);
  app.delete("/api/telegram/miniapp/brands/:slug", deleteBrand);
  app.post("/api/telegram/miniapp/brands/:slug/approve", approveBrand);
  app.get("/api/brands/published", listPublishedBrands);
  app.get("/api/telegram/miniapp/news", listNews);
  app.post("/api/telegram/miniapp/news", createNews);
  app.patch("/api/telegram/miniapp/news/:slug", updateNews);
  app.post("/api/telegram/miniapp/news/:slug/approve", approveNews);
  app.delete("/api/telegram/miniapp/news/:slug", deleteNews);
  app.get("/api/news/published", listPublishedNews);
  app.post("/api/telegram/miniapp/products", createProduct);
  app.patch("/api/telegram/miniapp/products/:productId", updateProduct);
  app.delete("/api/telegram/miniapp/products/:productId", deleteProduct);
  app.post("/api/telegram/miniapp/products/:productId/approve", approveProduct);
}
