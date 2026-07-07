import { firefox } from 'playwright';
import { writeFileSync } from 'fs';

const SS = '/Users/admin-se/tmp/claude-501/-Users-admin-se-Documents-Project-SMS-Pagoda-2026/c3d97054-2ac1-49f9-a087-548faaa40d4f/scratchpad';
const log = (...a) => console.log(...a);

const browser = await firefox.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();

const jsErrors = [];
page.on('pageerror', e => jsErrors.push(e.message));
page.on('console', m => { if (m.type() === 'error') jsErrors.push(m.text()); });

// ── STEP 1: Login ──────────────────────────────────────────────────────
log('=== STEP 1: Login ===');
await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1000);

await page.fill('input[name="username"]', 'admin');
await page.fill('input[name="password"]', 'admin');
await page.keyboard.press('Enter');
await page.waitForTimeout(2500);
writeFileSync(`${SS}/02_after_login.png`, await page.screenshot({ fullPage: true }));
log('URL after login:', page.url());

// ── STEP 2: Navigate to /payroll ───────────────────────────────────────
log('\n=== STEP 2: Navigate to payroll ===');
await page.goto('http://localhost:5173/payroll', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
writeFileSync(`${SS}/03_payroll_loaded.png`, await page.screenshot({ fullPage: true }));
log('URL:', page.url());

// Check what's on the page
const title = await page.$eval('h1.page-title', el => el.textContent).catch(() => 'NOT FOUND');
log('Page title:', title);

const statCards = await page.$$eval('.glass-panel', els => els.length);
log('Glass panels:', statCards);

const tableRows = await page.$$eval('tbody tr', els => els.length);
log('Table rows:', tableRows);

const jsErr = jsErrors.filter(e => !e.includes('stylesheet') && !e.includes('MIME'));
log('JS Errors:', jsErr.length ? jsErr : 'none');

// ── STEP 3: Check teacher data in table ───────────────────────────────
log('\n=== STEP 3: Check table content ===');
const rows = await page.$$eval('tbody tr', trs => trs.map(tr => {
  const cells = [...tr.querySelectorAll('td')].map(td => td.textContent.trim());
  return cells;
}));
log('Table rows:', JSON.stringify(rows, null, 2));

// ── STEP 4: Teacher filter ─────────────────────────────────────────────
log('\n=== STEP 4: Teacher filter ===');
const filterTeacher = await page.$('#filter-teacher');
log('Teacher filter found:', !!filterTeacher);
if (filterTeacher) {
  const options = await page.$$eval('#filter-teacher option', opts => opts.map(o => ({ val: o.value, text: o.textContent.trim() })));
  log('Teacher options:', JSON.stringify(options));

  if (options.length > 1) {
    await page.selectOption('#filter-teacher', options[1].val);
    await page.waitForTimeout(800);
    writeFileSync(`${SS}/04_teacher_filtered.png`, await page.screenshot({ fullPage: true }));
    const filteredRows = await page.$$eval('tbody tr', trs => trs.length);
    log('Rows after teacher filter:', filteredRows);
  }
}

// ── STEP 5: Search box ─────────────────────────────────────────────────
log('\n=== STEP 5: Search box ===');
await page.fill('#search-input', '').catch(() => {});
await page.fill('#search-input', 'xxx-no-match').catch(() => log('search input not found'));
await page.waitForTimeout(500);
const emptyRows = await page.$$eval('tbody tr', trs => trs.length).catch(() => 0);
log('Rows with no-match search:', emptyRows);
await page.fill('#search-input', '');
writeFileSync(`${SS}/05_search.png`, await page.screenshot({ fullPage: true }));

// ── STEP 6: Open Add modal ─────────────────────────────────────────────
log('\n=== STEP 6: Add modal ===');
await page.click('[data-a="add"]').catch(() => log('Add button not found'));
await page.waitForTimeout(800);
writeFileSync(`${SS}/06_add_modal.png`, await page.screenshot({ fullPage: true }));
const modalVisible = await page.$('.vmodal-panel').catch(() => null);
log('Modal visible:', !!modalVisible);

// Check modal fields
const mTeacher = await page.$('#m-teacher');
const mSubject = await page.$('#m-subject');
const mRate    = await page.$('#m-rate');
log('Modal teacher select:', !!mTeacher);
log('Modal subject select:', !!mSubject);
log('Modal rate input:', !!mRate);

// Close modal
await page.click('[data-a="close"]').catch(() => page.keyboard.press('Escape'));
await page.waitForTimeout(500);

// ── STEP 7: Edit first row ─────────────────────────────────────────────
log('\n=== STEP 7: Edit first row ===');
const editBtn = await page.$('[data-a="edit"]');
log('Edit button found:', !!editBtn);
if (editBtn) {
  await editBtn.click();
  await page.waitForTimeout(800);
  writeFileSync(`${SS}/07_edit_modal.png`, await page.screenshot({ fullPage: true }));
  const rateVal = await page.$eval('#m-rate', el => el.value).catch(() => 'N/A');
  log('Rate pre-filled:', rateVal);
  const amountEl = await page.$eval('.vmodal-panel', el => el.querySelector('[style*="success"]')?.textContent || 'N/A');
  log('Amount shown:', amountEl);
  await page.click('[data-a="close"]').catch(() => {});
}

// Final screenshot
await page.waitForTimeout(500);
writeFileSync(`${SS}/08_final.png`, await page.screenshot({ fullPage: true }));
log('\n=== DONE ===');
log('All JS errors:', jsErrors.filter(e => !e.includes('stylesheet') && !e.includes('MIME')));

await browser.close();
