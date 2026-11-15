import { chromium, expect, test as base, type Browser, type BrowserContext, type Page } from '@playwright/test';

export const test = base.extend<{ browser: Browser; context: BrowserContext; page: Page }>({
  browser: [async ({}, use) => {
    const endpoint = process.env.OBSCURA_CDP_URL ?? 'ws://127.0.0.1:9222';
    const browser = await chromium.connectOverCDP(endpoint);
    try {
      await use(browser);
    } finally {
      await browser.close();
    }
  }, { scope: 'worker' }],
  context: async ({ browser }, use) => {
    const context = browser.contexts()[0];
    if (!context) throw new Error('Obscura CDP connection did not expose its default browser context');
    await use(context);
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    try {
      await use(page);
    } finally {
      await page.close();
    }
  },
});

export { expect };
