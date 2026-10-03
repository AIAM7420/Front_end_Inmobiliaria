import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    browserName: 'chromium',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROME_EXECUTABLE ||
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
    timeout: 30_000,
    env: { VITE_API_BASE_URL: 'http://127.0.0.1:8000/api/v1', VITE_LOCAL_PILOT_NO_EMAIL: 'false' },
  },
});
