import { chromium, expect, test as base, type Browser, type BrowserContext, type Page } from '@playwright/test';

export const test = base.extend<{ browser: Browser; context: BrowserContext; page: Page }>({
  browser: [async ({}, use) => {
    const endpoint = process.env.OBSCURA_CDP_URL ?? 'ws://127.0.0.1:9222';
    let browser: Browser;
    try {
      browser = await chromium.connectOverCDP(endpoint);
    } catch (err) {
      if (process.env.CI) {
        throw new Error(`CI environment requires Obscura CDP at ${endpoint}: ${(err as Error).message}`);
      }
      // Local fallback: launch standard Chromium if Obscura CDP daemon is not running locally
      browser = await chromium.launch({ headless: true });
    }
    try {
      await use(browser);
    } finally {
      await browser.close();
    }
  }, { scope: 'worker' }],
  context: async ({ browser }, use) => {
    const context = browser.contexts()[0] ?? await browser.newContext();
    await context.clearCookies();
    await use(context);
    await context.clearCookies();
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    const uncaughtErrors: string[] = [];
    const failedChunks: string[] = [];

    page.on('pageerror', error => {
      uncaughtErrors.push(error.stack ?? error.message);
    });

    page.on('requestfailed', request => {
      const url = request.url();
      if (url.includes('/_next/static/chunks/') || url.includes('/_next/static/')) {
        failedChunks.push(`${url} (${request.failure()?.errorText ?? 'failed'})`);
      }
    });

    page.on('response', response => {
      const url = response.url();
      if ((url.includes('/_next/static/chunks/') || url.includes('/_next/static/')) && response.status() >= 400) {
        failedChunks.push(`${response.status()} ${url}`);
      }
    });

    try {
      await use(page);

      if (uncaughtErrors.length > 0) {
        throw new Error(`Uncaught page error(s) during test execution:\n${uncaughtErrors.join('\n')}`);
      }
      if (failedChunks.length > 0) {
        throw new Error(`Failed first-party script chunk(s) during test execution:\n${failedChunks.join('\n')}`);
      }
    } finally {
      await page.close();
    }
  },
});

export { expect };
