import { chromium } from "playwright";
const base = "https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer/about.html?language-motion=1";
const browser = await chromium.launch({ headless: true });
const failures = [];
for (const reducedMotion of ["no-preference", "reduce"]) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion });
  await context.addInitScript(() => localStorage.setItem("fyzen_lang", "en"));
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.locator(".menu-toggle").click();
  await page.waitForTimeout(250);
  const result = await page.locator(".mobile-lang-switcher").evaluate((el) => {
    const button = el.querySelector(".lang-btn.active-lang");
    const styles = getComputedStyle(el);
    const buttonStyles = button ? getComputedStyle(button) : null;
    return {
      animationName: styles.animationName,
      transitionProperty: buttonStyles?.transitionProperty,
      activeBackground: buttonStyles?.backgroundImage,
      activeColor: buttonStyles?.color,
    };
  });
  const expectedAnimated = reducedMotion === "no-preference";
  const passed = expectedAnimated ? result.animationName === "mobile-language-reveal" : result.animationName === "none";
  if (!passed || !result.activeBackground?.includes("gradient")) failures.push({ reducedMotion, result });
  console.log(JSON.stringify({ reducedMotion, result, passed }));
  await context.close();
}
await browser.close();
if (failures.length) process.exit(1);
