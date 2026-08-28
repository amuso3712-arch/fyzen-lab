import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = 'http://localhost:3000';
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [375, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${base}/products.html?qa=brand-${width}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(160);
    const brandSelect = page.locator('#brandFilter');
    assert.equal(await brandSelect.count(), 1, `${width}px brand select missing`);
    const brandCount = await brandSelect.locator('option').count();
    assert.ok(brandCount > 1, `${width}px brand options were not populated`);
    const selectedBrand = await brandSelect.locator('option').nth(1).getAttribute('value');
    assert.ok(selectedBrand, `${width}px brand option has no value`);
    await brandSelect.selectOption(selectedBrand);
    assert.equal(await brandSelect.inputValue(), selectedBrand, `${width}px brand selection did not persist`);
    const visibleCount = await page.locator('#productGrid .product-card').count();
    assert.ok(visibleCount > 0, `${width}px brand filter returned no products for ${selectedBrand}`);
    const badge = page.locator('#mobileFilterBadge');
    assert.equal(await badge.textContent(), '1', `${width}px active brand badge is incorrect`);
    await page.locator('#mobileFilterTrigger').click();
    await page.locator('#mobileFilterClear').click();
    assert.equal(await brandSelect.inputValue(), '', `${width}px brand clear did not reset select`);

    await page.addInitScript(() => {
      localStorage.setItem('fyzen_cart', JSON.stringify([{ id: 1, name: 'QA Analyzer', quantity: 2 }]));
    });
    await page.goto(`${base}/checkout.html?qa=confirmation-${width}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(120);
    await page.route('**/api/orders', route => route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true }) }));
    await page.route('**/api/order-notification', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }));
    await page.fill('#custName', 'QA Buyer');
    await page.fill('#custPhone', '+998900000000');
    await page.locator('.order-summary-p button').click();
    await page.waitForTimeout(220);
    assert.equal(await page.locator('#successOverlay').evaluate(el => getComputedStyle(el).display), 'flex', `${width}px confirmation overlay missing`);
    const confirmation = await page.locator('#confirmationDetails').textContent();
    assert.match(confirmation, /QA Buyer/);
    assert.match(confirmation, /QA Analyzer/);
    assert.match(confirmation, /REQ-/);
    await context.close();
    console.log(JSON.stringify({ width, passed: true }));
  }
  console.log('ADMIN_CHECKOUT_BRAND_MOBILE=passed');
} finally {
  await browser.close();
}
