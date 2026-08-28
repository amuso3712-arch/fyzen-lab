import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await page.goto('https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer/index.html?v=13', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.locator('#loader').evaluate(el => { el.style.display = 'none'; });
await page.locator('.menu-toggle').click({ force: true });
await page.waitForTimeout(250);
const products = page.locator('.mobile-nav-dropdown').first();
const arrowCount = await page.locator('.mobile-nav-arrow').count();
const before = await products.getAttribute('class');
await products.locator('.mobile-nav-dropdown-toggle').click();
const after = await products.getAttribute('class');
await page.screenshot({ path: '/home/ubuntu/screenshots/products-drawer-mobile.png', fullPage: false });
console.log(JSON.stringify({ arrowCount, before, after, productText: await products.innerText() }, null, 2));
await browser.close();
