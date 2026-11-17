import { chromium } from 'playwright-core';

const targetUrl = process.env.PAGE_URL || 'https://krishujeniya.github.io/krishujeniya/';
const endpoint = process.env.OBSCURA_CDP_URL || 'http://127.0.0.1:9222';

console.log(`Connecting to Obscura CDP at ${endpoint}...`);
const browser = await chromium.connectOverCDP(endpoint);
const context = browser.contexts()[0] || (await browser.newContext());
const page = await context.newPage();

const uncaughtErrors = [];
page.on('pageerror', err => {
  uncaughtErrors.push(err.message || String(err));
});
page.on('response', res => {
  if (res.url().includes('/_next/static/') && res.status() >= 400) {
    uncaughtErrors.push(`Failed chunk: ${res.status()} ${res.url()}`);
  }
});

try {
  console.log(`Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // 1. Confirm contact form is rendered
  const nameInput = page.locator('#form-name');
  await nameInput.waitFor({ state: 'visible', timeout: 15000 });
  console.log('Confirmed contact form is rendered.');

  // 2. Open a case study / project dialog
  const projectButton = page.locator('#projects').getByRole('button').first();
  await projectButton.scrollIntoViewIfNeeded();
  await projectButton.click({ force: true });
  const dialog = page.locator('#project-modal');
  await dialog.waitFor({ state: 'visible', timeout: 8000 });
  console.log('Confirmed case study modal dialog opened successfully.');

  // 3. Close project dialog with Escape
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden', timeout: 5000 });
  console.log('Confirmed case study modal closed successfully.');

  // 4. Toggle a field in the contact section
  const serviceBtn = page.locator('#contact button').filter({ hasText: 'Agentic AI' });
  await serviceBtn.scrollIntoViewIfNeeded();
  await serviceBtn.click();
  const pressed = await serviceBtn.getAttribute('aria-pressed');
  if (pressed !== 'true') {
    throw new Error(`Expected button aria-pressed to be "true", got "${pressed}"`);
  }
  console.log('Confirmed interactive field toggle succeeded.');

  if (uncaughtErrors.length > 0) {
    throw new Error(`Uncaught errors during published smoke test:\n${uncaughtErrors.join('\n')}`);
  }

  console.log('Published smoke test completed successfully.');
} finally {
  await page.close();
  await browser.close();
}
