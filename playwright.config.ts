import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4173/krishujeniya/',
  },
  webServer: {
    command: 'node scripts/serve-static.mjs',
    url: 'http://127.0.0.1:4173/krishujeniya/',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
