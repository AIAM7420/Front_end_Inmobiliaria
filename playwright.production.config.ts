import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/pwa-release.spec.ts',
  workers: 1,
  retries: 0,
  reporter: 'list',
  globalSetup: './e2e/setup.ts',
  use: {
    baseURL: 'http://127.0.0.1:5180',
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROME_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node e2e/production-server.mjs',
    url: 'http://127.0.0.1:5180',
    reuseExistingServer: false,
  },
});
