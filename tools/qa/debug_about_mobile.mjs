import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
for (const width of [375, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 844 } });
  await page.goto(`https://3000-idoosqu28lnue7qss1a3m-e8b50e28.us5.manus.computer/about.html?about-mobile-debug=${width}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(450);
  const data = await page.evaluate(() => {
    const get = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return { sel, rect: { x:r.x, y:r.y, width:r.width, height:r.height }, fontSize:s.fontSize, lineHeight:s.lineHeight, padding:s.padding, margin:s.margin, overflow:s.overflow };
    };
    return {
      viewport: innerWidth,
      navbar: get('.navbar'),
      companyBlock: get('.company-block'),
      card: get('.hero-glass-card'),
      logo: get('.floating-logo'),
      title: get('.company-text h1'),
      desc: get('.company-text > p'),
      advantages: get('.advantage-grid'),
      bottom: get('.about-bottom-grid'),
      values: get('.values-grid'),
      clients: get('.clients-section'),
      footer: get('footer'),
      scrollWidth: document.documentElement.scrollWidth,
    };
  });
  console.log(JSON.stringify(data));
  await page.close();
}
await browser.close();
