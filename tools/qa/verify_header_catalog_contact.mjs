import { chromium } from "playwright";
import assert from "node:assert/strict";

const baseUrl = "https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer";
const publicPages = ["/index.html", "/brands.html", "/blog.html", "/about.html", "/contact.html", "/catalog.html", "/products.html", "/cart.html", "/checkout.html", "/wishlist.html", "/product-details.html"];
const expected = {
  uz: { nav: ["Katalog", "Mahsulotlar", "Brendlar", "Biz haqimizda", "Yangiliklar", "Aloqa"], category: "Analitik uskunalar", description: "Spektroskopiya", catalog: [["Analitik uskunalar", "Spektroskopiya, xromatografiya, tarozilar, mikroskoplar."], ["Tibbiy va klinik laboratoriya", "Diagnostik analizatorlar, sentrifugalar, inkubatorlar, PZR tizimlari."], ["Kimyo laboratoriyasi", "Kimyoviy tahlil asboblari va laboratoriya idishlari."], ["Fizika laboratoriyasi", "Fizika laboratoriyalari uchun o'quv va tadqiqot uskunalari."], ["Biologiya va mikrobiologiya", "Mikroskoplar, inkubatorlar, sterilizatorlar, mikrobiologiya tizimlari."], ["Atrof-muhitni tekshirish", "Havo, suv va atrof-muhitni monitoring qilish asboblari."], ["Qishloq xo'jaligi va tuproq tahlili", "Tuproq, o'g'it, sug'orish va qishloq xo'jaligini sinash yechimlari."], ["Sanoat va material sinash", "Materialning mustahkamligi, chidamliligi va sifat nazorati tizimlari."], ["Neft va konchilik laboratoriyalari", "Neft, gaz va konchilik sohalari uchun sinov asboblari."], ["O'quv laboratoriyasi", "Maktablar, kollejlar va universitetlar uchun laboratoriya yechimlari."], ["Laboratoriya mebellari va xavfsizligi", "Vityajka shkaflari, laboratoriya stollari, saqlash tizimlari va xavfsizlik vositalari."], ["Sarf materiallari va aksessuarlar", "Laboratoriya idishlari, pipetkalar, filtrlar, reaktivlar va sarf materiallari."]], contact: [["Manzil", "Xorazm"], ["Telefon", "+998"], ["Email", "info@fyzen-lab.uz"], ["Telegram", "@fyzen_lab"], ["Instagram", "@fyzen.lab"]] },
  ru: { nav: ["Каталог", "Продукты", "Бренды", "О нас", "Новости", "Контакты"], category: "Аналитические приборы", description: "Спектроскопия", catalog: [["Аналитические приборы", "Спектроскопия, хроматография, весы, микроскопы."], ["Медицинская и клиническая лаборатория", "Диагностические анализаторы, центрифуги, инкубаторы, ПЦР-системы."], ["Химическая лаборатория", "Приборы для химического анализа и лабораторная посуда."], ["Физическая лаборатория", "Учебное и исследовательское оборудование для физических лабораторий."], ["Биология и микробиология", "Микроскопы, инкубаторы, стерилизаторы, микробиологические системы."], ["Экологический мониторинг", "Приборы для мониторинга воздуха, воды и окружающей среды."], ["Сельское хозяйство и анализ почв", "Решения для тестирования почвы, удобрений, ирригации и сельского хозяйства."], ["Промышленные и материальные испытания", "Системы контроля прочности, долговечности и качества материалов."], ["Нефтяные и горнодобывающие лаборатории", "Испытательные приборы для нефтяного, газового и горнодобывающего секторов."], ["Учебная лаборатория", "Лабораторные решения для школ, колледжей и университетов."], ["Лабораторная мебель и безопасность", "Вытяжные шкафы, лабораторные столы, системы хранения и средства безопасности."], ["Расходные материалы и аксессуары", "Стеклянная посуда, пипетки, фильтры, реагенты и лабораторные расходные материалы."]], contact: [["Адрес", "Хорезм"], ["Телефон", "+998"], ["Email", "info@fyzen-lab.uz"], ["Telegram", "@fyzen_lab"], ["Instagram", "@fyzen.lab"]] },
  en: { nav: ["Catalog", "Products", "Brands", "About Us", "News", "Contact"], category: "Analytical Instruments", description: "Spectroscopy", catalog: [["Analytical Instruments", "Spectroscopy, chromatography, balances, microscopes."], ["Medical & Clinical Laboratory", "Diagnostic analyzers, centrifuges, incubators, PCR systems."], ["Chemistry Laboratory", "Chemical analysis instruments and laboratory glassware."], ["Physics Laboratory", "Educational and research equipment for physics laboratories."], ["Biology & Microbiology", "Microscopes, incubators, sterilizers, microbiology systems."], ["Environmental Testing", "Air, water, and environmental monitoring instruments."], ["Agriculture & Soil Testing", "Soil, fertilizer, irrigation, and agricultural testing solutions."], ["Industrial & Material Testing", "Material strength, durability, and quality-control systems."], ["Petroleum & Mining Labs", "Testing instruments for petroleum, gas, and mining sectors."], ["Educational Laboratory", "Laboratory solutions for schools, colleges, and universities."], ["Laboratory Furniture & Safety", "Fume hoods, lab tables, storage systems, and safety products."], ["Consumables & Accessories", "Glassware, pipettes, filters, reagents, and laboratory supplies."]], contact: [["Address", "Khorezm"], ["Phone", "+998"], ["Email", "info@fyzen-lab.uz"], ["Telegram", "@fyzen_lab"], ["Instagram", "@fyzen.lab"]] },
};
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [375, 390]) {
    for (const lang of ["uz", "ru", "en"]) {
    const page = await browser.newPage({ viewport: { width, height: 812 } });
    await page.addInitScript(language => localStorage.setItem("fyzen_lang", language), lang);
    for (const path of publicPages) {
      await page.goto(`${baseUrl}${path}?compact-audit=${width}`, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(250);
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        headerRight: document.querySelector(".nav-inner")?.getBoundingClientRect().right ?? window.innerWidth,
        chat: Boolean(document.querySelector("#fyzenFabMain")),
      }));
      assert.ok(state.overflow <= 1, `${width}px ${path} horizontal overflow ${state.overflow}`);
      assert.ok(state.headerRight <= width + 1, `${width}px ${path} header exceeds viewport`);
      assert.equal(state.chat, true, `${width}px ${lang} ${path} missing chat trigger`);
      const navText = await page.locator(".nav-links").innerText();
      assert.ok(navText.trim().length > 20, `${width}px ${lang} ${path} header translation is empty`);
      if (path === "/index.html") {
        for (const label of expected[lang].nav) assert.ok(navText.includes(label), `${width}px ${lang} missing header label: ${label}`);
      }
    }

    await page.goto(`${baseUrl}/catalog.html?compact-audit=${width}&lang=${lang}`, { waitUntil: "domcontentloaded", timeout: 15000 });
    const catalog = page.locator(".cat-card-p").first();
    assert.equal(await page.locator("#catalogMobileFilterTrigger").count(), 0, `${width}px ${lang} Catalog filter trigger remains`);
    const catalogCards = page.locator(".cat-card-p");
    assert.equal(await catalogCards.count(), 12, `${width}px ${lang} Catalog row count changed`);
    for (let index = 0; index < await catalogCards.count(); index += 1) {
      const row = catalogCards.nth(index);
      const title = await row.locator("h3").innerText();
      const description = await row.locator("p").innerText();
      const [expectedTitle, expectedDescription] = expected[lang].catalog[index];
      assert.equal(title.trim(), expectedTitle, `${width}px ${lang} Catalog title ${index} mismatch`);
      assert.equal(description.trim(), expectedDescription, `${width}px ${lang} Catalog description ${index} mismatch`);
      await row.click();
      await page.waitForTimeout(260);
      assert.ok((await row.locator(".cat-text-area p").evaluate(el => getComputedStyle(el).opacity)) > 0, `${width}px ${lang} Catalog description ${index} remains hidden`);
      await row.evaluate(el => el.classList.remove("is-expanded"));
    }
    assert.equal(await catalogCards.first().locator("h3").innerText().then(text => text.trim().length > 2), true, `${width}px ${lang} Catalog first row became unavailable`);

    await page.goto(`${baseUrl}/contact.html?compact-audit=${width}&lang=${lang}`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.reload({ waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(250);
    const contactCards = page.locator(".contact-info .info-card");
    assert.equal(await contactCards.count(), 5, `${width}px ${lang} Contact card count changed`);
    for (let index = 0; index < expected[lang].contact.length; index += 1) {
      const contactText = (await contactCards.nth(index).innerText()).toLocaleLowerCase();
      const [label, value] = expected[lang].contact[index];
      assert.ok(contactText.includes(label.toLocaleLowerCase()), `${width}px ${lang} Contact label ${index} is wrong`);
      assert.ok(contactText.includes(value.toLocaleLowerCase()), `${width}px ${lang} Contact value ${index} is wrong`);
    }
    const contactCard = contactCards.nth(1);
    await contactCard.click();
    assert.equal(await contactCard.evaluate(el => el.classList.contains("is-open")), true, `${width}px Contact card does not expand`);
    assert.equal(await contactCard.getAttribute("aria-expanded"), "true", `${width}px Contact aria-expanded missing`);
    await page.close();
    }
  }
  console.log("HEADER_CATALOG_CONTACT_RESPONSIVE_I18N=passed");
} finally {
  await browser.close();
}
