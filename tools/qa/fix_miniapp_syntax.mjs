import { readFileSync, writeFileSync } from "node:fs";
const path = "client/telegram-admin.html";
const html = readFileSync(path, "utf8");
const replacement = String.raw`  async function loadProducts(){
    const root = $("productsList");
    root.innerHTML = '<div class="empty">Yuklanmoqda…</div>';
    try {
      const data = await api("/api/telegram/miniapp/products");
      if (!data.products?.length) { root.innerHTML = '<div class="empty">Mahsulotlar topilmadi.</div>'; return; }
      root.innerHTML = data.products.map(p => {
        const action = p.status === "draft"
          ? '<button class="primary" data-approve="' + esc(p.productId) + '">Tasdiqlash</button>'
          : '<button class="secondary" disabled>Public katalogda</button>';
        return '<article class="card"><div class="card-head"><div><h3>' + esc(p.name) + '</h3><div>' + esc(p.brand) + ' · ' + esc(p.category) + '</div><div class="muted small">' + esc(p.price || "Request") + '</div></div><span class="badge">' + esc(p.status) + '</span></div><p class="muted small">' + esc(p.description || "Tavsif kiritilmagan") + '</p><div class="actions"><button class="secondary" data-edit="' + esc(p.productId) + '">Tahrirlash</button>' + action + '</div></article>';
      }).join("");
      root.querySelectorAll("[data-approve]").forEach(btn => btn.onclick = async () => {
        btn.disabled = true;
        try { await api("/api/telegram/miniapp/products/" + encodeURIComponent(btn.dataset.approve) + "/approve", {method:"POST"}); notice("Mahsulot tasdiqlandi va katalogga chiqarildi", "success"); await loadProducts(); }
        catch (e) { notice(e.message, "error"); }
        finally { btn.disabled = false; }
      });
      root.querySelectorAll("[data-edit]").forEach(btn => btn.onclick = async () => {
        const current = data.products.find(p => p.productId === btn.dataset.edit);
        if (!current) return;
        const name = prompt("Nomi", current.name); if (name === null) return;
        const brand = prompt("Brend", current.brand); if (brand === null) return;
        const category = prompt("Kategoriya", current.category); if (category === null) return;
        const price = prompt("Narx", current.price || "Request"); if (price === null) return;
        const description = prompt("Tavsif", current.description || ""); if (description === null) return;
        btn.disabled = true;
        try { await api("/api/telegram/miniapp/products/" + encodeURIComponent(btn.dataset.edit), {method:"PATCH", body:JSON.stringify({name, brand, category, price, description})}); notice("Mahsulot yangilandi", "success"); await loadProducts(); }
        catch (e) { notice(e.message, "error"); }
        finally { btn.disabled = false; }
      });
    } catch (e) { root.innerHTML = '<div class="empty error">' + esc(e.message) + '</div>'; }
  }
`;
const start = html.indexOf('  async function loadProducts()');
const end = html.indexOf('  $("productForm")', start);
if (start < 0 || end < 0) throw new Error("loadProducts block markers not found");
writeFileSync(path, html.slice(0, start) + replacement + '  $("productForm")' + html.slice(end + '  $("productForm")'.length));
