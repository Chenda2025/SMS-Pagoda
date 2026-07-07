import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
await page.fill('input[placeholder*="Username"]', 'admin');
await page.fill('input[placeholder*="Password"]', 'TempAdmin123!');
await page.click('button:has-text("Login")');
await page.waitForTimeout(1500);

await page.goto('http://localhost:5173/grades', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// list select options
const selects = await page.$$('select');
for (const [i, sel] of selects.entries()) {
  const opts = await sel.evaluate(el => Array.from(el.options).map(o => ({v:o.value, t:o.textContent})));
  console.log('SELECT', i, JSON.stringify(opts));
}
await browser.close();
