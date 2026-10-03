import { defineConfig } from '@playwright/test';
const port = Number(process.env.E2E_FRONTEND_PORT ?? '5180');
const api = process.env.E2E_API_URL ?? 'http://127.0.0.1:8000/api/v1';

export default defineConfig({
  testDir: './e2e',
  testIgnore: '**/local-pilot.spec.ts',
  workers: 1,
  retries: 0,
  reporter: 'list',
  globalSetup: './e2e/setup.ts',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: 'chromium',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROME_EXECUTABLE ||
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 30_000,
    env: { VITE_API_BASE_URL: api, VITE_LOCAL_PILOT_NO_EMAIL: 'false', VITE_MAPBOX_PUBLIC_TOKEN: '' },
  },
});
