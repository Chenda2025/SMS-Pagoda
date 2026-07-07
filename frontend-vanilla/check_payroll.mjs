import { chromium } from 'playwright';

const SCRSHOT = (name) => `/Users/admin-se/tmp/payroll_${name}.png`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(20000);

const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', err => consoleErrors.push(err.message));

// Navigate to login
await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

// Fill login form
await page.fill('input[type="text"], input[name="username"], #username', 'admin');
await page.fill('input[type="password"], input[name="password"], #password', 'admin');
await page.screenshot({ path: SCRSHOT('1_login_form'), fullPage: true });

// Submit
await page.click('button[type="submit"]');
await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 }).catch(() => {});
await page.screenshot({ path: SCRSHOT('2_after_login'), fullPage: true });
console.log('After login URL:', page.url());

// Navigate to payroll
await page.goto('http://localhost:5173/#/payroll', { waitUntil: 'networkidle' });
await page.screenshot({ path: SCRSHOT('3_payroll_hash'), fullPage: true });
console.log('Payroll hash URL:', page.url());

// Try /payroll path directly
await page.goto('http://localhost:5173/payroll', { waitUntil: 'networkidle' });
await page.screenshot({ path: SCRSHOT('4_payroll_path'), fullPage: true });
console.log('Payroll path URL:', page.url());

const bodyText = await page.locator('body').innerText().catch(() => '');
console.log('PAYROLL BODY SNIPPET:', bodyText.slice(0, 600));
console.log('CONSOLE ERRORS:', consoleErrors);

await browser.close();
