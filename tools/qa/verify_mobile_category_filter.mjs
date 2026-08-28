import { chromium } from "playwright";
import assert from "node:assert/strict";

const baseUrl = process.env.FYZEN_PREVIEW_URL || "https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer";
const widths = [375, 390];
const languages = ["ru", "uz", "en"];

const browser = await chromium.launch({ headless: true });

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 844 } });
    await page.goto(`${baseUrl}/products.html?category-filter-audit=${width}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(250);

    const productsInitial = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      triggerVisible: getComputedStyle(document.querySelector("#mobileFilterTrigger")).display !== "none",
      optionsClosed: (() => { const style = getComputedStyle(document.querySelector("#categoryFilterOptions")); return style.visibility === "hidden" && style.pointerEvents === "none"; })(),
      selected: document.querySelector("#mobileFilterSelected")?.textContent?.trim(),
    }));
    assert.ok(productsInitial.overflow <= 1, `Products ${width}px has horizontal overflow: ${productsInitial.overflow}px`);
    assert.equal(productsInitial.triggerVisible, true, `Products ${width}px mobile trigger is hidden`);
    assert.equal(productsInitial.optionsClosed, true, `Products ${width}px popover is open on load`);
    assert.ok(productsInitial.selected, `Products ${width}px has no selected category label`);

    await page.locator("#mobileFilterTrigger").click();
    assert.equal(await page.locator("#mobileFilterTrigger").getAttribute("aria-expanded"), "true", `Products ${width}px trigger did not open`);
    assert.equal(await page.locator("#categoryFilterOptions").isVisible(), true, `Products ${width}px options are not visible`);
    await page.locator("#categoryFilterOptions .cat-option").nth(1).click();
    await page.waitForTimeout(260);
    assert.equal(await page.locator("#mobileFilterTrigger").getAttribute("aria-expanded"), "false", `Products ${width}px popover did not close after selection`);
    assert.equal(await page.locator("#categoryFilterOptions").isVisible(), false, `Products ${width}px options stayed visible after selection`);
    assert.equal(await page.locator("#categoryFilterOptions .cat-option.active").count(), 1, `Products ${width}px has an invalid active category count`);
    assert.equal(await page.locator("#mobileFilterBadge").textContent(), "1", `Products ${width}px badge count did not update`);

    await page.locator("#mobileFilterTrigger").click();
    await page.locator("#mobileFilterClear").click();
    assert.equal(await page.locator("#mobileFilterBadge").getAttribute("hidden"), "", `Products ${width}px clear action did not hide badge`);
    assert.equal((await page.locator("#mobileFilterSelected").textContent()).trim(), (await page.locator("#categoryFilterOptions .cat-option.active span").textContent()).trim(), `Products ${width}px clear action did not restore all label`);

    for (const lang of languages) {
      await page.evaluate((nextLang) => window.changeLanguage(nextLang), lang);
      await page.waitForTimeout(60);
      const labels = await page.evaluate(() => ({
        selected: document.querySelector("#mobileFilterSelected")?.textContent?.trim(),
        active: document.querySelector("#categoryFilterOptions .cat-option.active span")?.textContent?.trim(),
      }));
      assert.equal(labels.selected, labels.active, `Products ${width}px ${lang} selected label is out of sync`);
    }

    await page.locator("#mobileFilterTrigger").click();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#mobileFilterTrigger").getAttribute("aria-expanded"), "false", `Products ${width}px Escape did not close the popover`);
    await page.close();

    const catalog = await browser.newPage({ viewport: { width, height: 844 } });
    await catalog.goto(`${baseUrl}/catalog.html?category-filter-audit=${width}`, { waitUntil: "networkidle" });
    await catalog.waitForTimeout(250);
    const catalogInitial = await catalog.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      legacyTriggerAbsent: !document.querySelector("#catalogMobileFilterTrigger"),
      gridVisible: getComputedStyle(document.querySelector(".categories-grid-p")).display !== "none",
      cards: document.querySelectorAll(".categories-grid-p .cat-card-p").length,
    }));
    assert.ok(catalogInitial.overflow <= 1, `Catalog ${width}px has horizontal overflow: ${catalogInitial.overflow}px`);
    assert.equal(catalogInitial.legacyTriggerAbsent, true, `Catalog ${width}px retains the removed legacy filter trigger`);
    assert.equal(catalogInitial.gridVisible, true, `Catalog ${width}px vertical category list is hidden`);
    assert.equal(catalogInitial.cards, 12, `Catalog ${width}px category card count changed`);
    for (const lang of languages) {
      await catalog.evaluate((nextLang) => window.changeLanguage(nextLang), lang);
      await catalog.waitForTimeout(60);
      const labels = await catalog.locator(".categories-grid-p .cat-card-p").evaluateAll(cards => cards.slice(0, 3).map(card => ({ title: card.querySelector("h3")?.textContent?.trim(), description: card.querySelector("p")?.textContent?.trim() })));
      for (const label of labels) {
        assert.ok(label.title && label.title.length > 2 && !label.title.includes("cat_"), `Catalog ${width}px ${lang} has an untranslated category title`);
        assert.ok(label.description && label.description.length > 2 && !label.description.includes("cat_"), `Catalog ${width}px ${lang} has an untranslated category description`);
      }
    }
    await catalog.close();
  }

  console.log("MOBILE_CATEGORY_FILTER=passed");
} finally {
  await browser.close();
}
