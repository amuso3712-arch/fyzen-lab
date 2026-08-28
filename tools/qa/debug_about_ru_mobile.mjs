import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
for (const width of [375, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 844 } });
  await context.addInitScript(() => localStorage.setItem('fyzen_lang', 'ru'));
  const page = await context.newPage();
  await page.goto(`https://3000-idoosqu28lnue7qss1a3m-e8b50e28.us5.manus.computer/about.html?about-ru-debug=${width}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const data = await page.evaluate(() => {
    const info = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return { rect: { x:r.x, y:r.y, width:r.width, height:r.height, right:r.right }, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, overflowWrap:s.overflowWrap, wordBreak:s.wordBreak, minWidth:s.minWidth, maxWidth:s.maxWidth, width:s.width, display:s.display, flex:s.flex };
    };
    const title = document.querySelector('.company-text h1');
    return { lang: document.documentElement.lang, text: title?.innerText, bodyScrollLeft: document.scrollingElement?.scrollLeft, documentScrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth, viewport: innerWidth, navbar:info('.navbar'), card:info('.hero-glass-card'), companyText:info('.company-text'), title:info('.company-text h1'), strong:info('.company-text h1 strong'), desc:info('.company-text > p') };
  });
  console.log(JSON.stringify(data));
  await page.screenshot({ path: `/home/ubuntu/about-ru-${width}.png`, fullPage: false });
  await context.close();
}
await browser.close();
