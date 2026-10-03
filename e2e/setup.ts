import { request } from '@playwright/test';

export default async function setup() {
  const api = process.env.E2E_API_URL ?? 'http://127.0.0.1:8000/api/v1';
  const client = await request.newContext();
  try {
    const response = await client.get(api.replace(/\/api\/v1$/, '') + '/__e2e/identity');
    if (!response.ok() || !(await response.json()).isolated_test_database) {
      throw new Error('Las pruebas de navegador requieren el servidor E2E y su base de pruebas aislada.');
    }
  } finally { await client.dispose(); }
}
