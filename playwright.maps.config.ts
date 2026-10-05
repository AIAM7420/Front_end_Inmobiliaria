import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({ ...base,
  testIgnore: [],
  testMatch: '**/ui-maps.spec.ts',
  use: { ...base.use, launchOptions: { ...base.use?.launchOptions,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } },
  webServer: { ...base.webServer as object, env: {
    VITE_API_BASE_URL: process.env.E2E_API_URL ?? 'http://127.0.0.1:8002/api/v1',
    VITE_LOCAL_PILOT_NO_EMAIL: 'false',
    // Deliberately synthetic. All Mapbox requests are intercepted with local styles.
    VITE_MAPBOX_PUBLIC_TOKEN: 'pk.local-controlled-test',
  } },
});
