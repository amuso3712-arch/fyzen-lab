import { readFileSync, writeFileSync } from "node:fs";

const path = "client/assets/js/lang.js";
const source = readFileSync(path, "utf8");
const replacements = {
  en: {
    blog_post1_full: "Mindray hematology analyzers are now available through FYZEN-LAB in Uzbekistan, helping clinics work faster with precise results.",
    blog_post2_full: "At UzMedExpo 2026 in Tashkent, FYZEN-LAB presented laboratory solutions and built new healthcare partnerships.",
    faq_a1: "In-stock equipment arrives within 1–3 business days. Special orders follow the delivery terms in the contract.",
    official_warranty_p: "Official factory warranty and professional service are provided for all products.",
    brand_default_desc: "Long-term cooperation with this brand. More product information will be added soon.",
    modal_kafolat_body: "<p><strong>All equipment</strong> includes warranty and service under the manufacturer’s terms.</p><br><p>Products meet stated specifications.</p>",
    modal_tolov_body: "<p>Payment is arranged by contract through bank transfer or corporate payment systems. Flexible schedules may be available.</p>",
    modal_servis_body: "<p>Our engineers provide installation, commissioning, calibration, maintenance, and spare-parts support.</p>",
    modal_talim_body: "<p>Specialists provide focused training and briefings so equipment users can work confidently and efficiently.</p>",
    modal_tanlash_body: "<p>We recommend equipment based on your laboratory needs, technical requirements, and budget.</p>",
  },
  uz: {
    blog_post1_full: "Mindray gematologik analizatorlari FYZEN-LAB orqali O'zbekistonda mavjud. Ular klinikalarga aniq va tezkor natijalar beradi.",
    blog_post2_full: "FYZEN-LAB Toshkentdagi UzMedExpo 2026 ko'rgazmasida laboratoriya yechimlari va yangi hamkorliklarni namoyish etdi.",
    faq_a1: "Ombordagi uskunalar 1–3 ish kunida yetkaziladi. Maxsus buyurtmalar muddati shartnomada belgilanadi.",
    official_warranty_p: "Barcha mahsulotlarga rasmiy zavod kafolati va professional servis xizmati taqdim etiladi.",
    brand_default_desc: "Ushbu brend bilan uzoq muddatli hamkorlik qilamiz. Qo'shimcha ma'lumot tez orada qo'shiladi.",
    modal_kafolat_body: "<p><strong>Barcha uskunalar</strong> ishlab chiqaruvchi shartlari asosida kafolat va servisga ega.</p><br><p>Mahsulotlar texnik talablarga mos.</p>",
    modal_tolov_body: "<p>To'lov shartnoma asosida bank o'tkazmasi yoki korporativ tizimlar orqali amalga oshiriladi. Moslashuvchan jadval mavjud bo'lishi mumkin.</p>",
    modal_servis_body: "<p>Muhandislarimiz o'rnatish, sozlash, kalibrlash, texnik xizmat va ehtiyot qismlar bo'yicha yordam beradi.</p>",
    modal_talim_body: "<p>Mutaxassislar uskunadan ishonchli va samarali foydalanish uchun qisqa o'quv va yo'riqnoma beradi.</p>",
    modal_tanlash_body: "<p>Laboratoriyangiz ehtiyoji, texnik talabi va byudjetiga mos uskunani tavsiya qilamiz.</p>",
  },
  ru: {
    blog_post1_full: "Гематологические анализаторы Mindray теперь доступны в Узбекистане через FYZEN-LAB. Они обеспечивают точные результаты и ускоряют работу клиник.",
    blog_post2_full: "На выставке UzMedExpo 2026 в Ташкенте FYZEN-LAB представила практичные лабораторные решения и заключила новые партнерства.",
    faq_a1: "Оборудование со склада доставляется за 1–3 рабочих дня. Срок спецзаказа указывается в договоре.",
    official_warranty_p: "На все товары предоставляются официальная заводская гарантия и профессиональный сервис.",
    brand_default_desc: "Мы долгосрочно сотрудничаем с этим брендом. Дополнительная информация появится скоро.",
    modal_kafolat_body: "<p><strong>Все оборудование</strong> имеет гарантию и сервис по условиям производителя.</p><br><p>Продукция соответствует заявленным характеристикам.</p>",
    modal_tolov_body: "<p>Оплата проводится по договору банковским переводом или через корпоративные системы. Возможен гибкий график.</p>",
    modal_servis_body: "<p>Наши инженеры выполняют установку, настройку, калибровку, обслуживание и помогают с запчастями.</p>",
    modal_talim_body: "<p>Специалисты проводят краткое обучение и инструктаж, чтобы пользователи уверенно работали с оборудованием.</p>",
    modal_tanlash_body: "<p>Мы подберем оборудование с учетом задач лаборатории, технических требований и бюджета.</p>",
  },
};

let currentLang = null;
let changed = 0;
const lines = source.split(/\r?\n/).map((line) => {
  const section = line.match(/^    (en|uz|ru): \{$/);
  if (section) currentLang = section[1];
  if (!currentLang) return line;
  const keyMatch = line.match(/^(\s{8})([A-Za-z0-9_]+):/);
  if (!keyMatch || !replacements[currentLang][keyMatch[2]]) return line;
  const key = keyMatch[2];
  const value = replacements[currentLang][key].replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  changed += 1;
  return `${keyMatch[1]}${key}: "${value}",`;
});

if (changed !== 30) throw new Error(`Expected 30 replacements, changed ${changed}`);
writeFileSync(path, lines.join("\n"));
console.log(`Updated ${changed} multilingual copy values.`);
