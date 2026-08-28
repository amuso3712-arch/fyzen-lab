import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = 'http://localhost:3000';
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [375, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 812 } });
    const page = await context.newPage();

    await page.goto(`${base}/contact.html?qa=${width}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(120);
    await page.route('**/api/contact', async route => {
      await new Promise(resolve => setTimeout(resolve, 180));
      await route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ success: false }) });
    });
    await page.fill('#contactName', 'QA Contact');
    await page.fill('#contactEmail', 'qa@example.com');
    await page.fill('#contactMsg', 'QA failure state');
    const contactButton = page.locator('#contactForm button');
    await contactButton.click();
    await page.waitForTimeout(60);
    assert.equal(await contactButton.getAttribute('aria-busy'), 'true', `${width}px contact loading state missing`);
    await page.waitForTimeout(220);
    assert.match(await page.locator('#contactStatus').textContent(), /Xabar|Message|Сообщение/i, `${width}px contact error status missing`);
    assert.equal(await contactButton.isDisabled(), false, `${width}px contact button did not re-enable after failure`);
    await page.unroute('**/api/contact');

    await page.route('**/api/contact', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await page.click('#contactForm button');
    await page.waitForTimeout(160);
    assert.match(await page.locator('#contactStatus').textContent(), /muvaffaqiyat|successfully|успешно/i, `${width}px contact success status missing`);
    assert.equal(await page.inputValue('#contactName'), '', `${width}px contact form did not reset after success`);
    await page.unroute('**/api/contact');

    await page.addInitScript(() => {
      localStorage.setItem('fyzen_cart', JSON.stringify([{ id: 1, name: 'QA Analyzer', quantity: 1 }]));
      localStorage.removeItem('fyzen_orders');
    });
    await page.goto(`${base}/checkout.html?qa=${width}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(120);
    await page.route('**/api/orders', async route => {
      await new Promise(resolve => setTimeout(resolve, 180));
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await page.route('**/api/order-notification', async route => {
      await new Promise(resolve => setTimeout(resolve, 180));
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await page.fill('#custName', 'QA Buyer');
    await page.fill('#custPhone', '+998900000000');
    const checkoutButton = page.locator('.order-summary-p button');
    await checkoutButton.click();
    await page.waitForTimeout(60);
    assert.equal(await checkoutButton.getAttribute('aria-busy'), 'true', `${width}px checkout loading state missing`);
    await page.waitForTimeout(420);
    assert.equal(await page.locator('#successOverlay').evaluate(el => getComputedStyle(el).display), 'flex', `${width}px checkout success overlay missing`);
    assert.equal(await page.evaluate(() => localStorage.getItem('fyzen_cart')), null, `${width}px cart was not cleared after success`);

    await page.unroute('**/api/orders');
    await page.unroute('**/api/order-notification');
    await page.evaluate(() => localStorage.setItem('fyzen_cart', JSON.stringify([{ id: 2, name: 'QA Retry Analyzer', quantity: 1 }])));
    await page.goto(`${base}/checkout.html?qa=${width}-failure`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(120);
    await page.route('**/api/orders', async route => {
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await page.route('**/api/order-notification', async route => {
      await route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ success: false }) });
    });
    await page.fill('#custName', 'QA Retry Buyer');
    await page.fill('#custPhone', '+998900000000');
    const retryButton = page.locator('.order-summary-p button');
    await retryButton.click();
    await page.waitForTimeout(180);
    assert.match(await page.locator('#checkoutStatus').textContent(), /Telegram|Telegramga|Telegram/i, `${width}px checkout failure status missing`);
    assert.equal(await retryButton.isDisabled(), false, `${width}px checkout button did not re-enable after failure`);
    assert.notEqual(await page.evaluate(() => localStorage.getItem('fyzen_cart')), null, `${width}px cart was lost after Telegram failure`);

    await context.close();
    console.log(JSON.stringify({ width, passed: true }));
  }
  console.log('CONTACT_CHECKOUT_MOBILE=passed');
} finally {
  await browser.close();
}
