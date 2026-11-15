import { chromium, expect, test as base, type Browser } from '@playwright/test';

export const test = base.extend<{ browser: Browser }>({
  browser: [async ({}, use) => {
    const endpoint = process.env.OBSCURA_CDP_URL ?? 'ws://127.0.0.1:9222';
    const browser = await chromium.connectOverCDP(endpoint);
    await use(browser);
    await browser.close();
  }, { scope: 'worker' }],
});

export { expect };
