import { expect, test } from '@playwright/test';

const api = process.env.E2E_API_URL ?? 'http://127.0.0.1:8000/api/v1';
const base = `http://127.0.0.1:${process.env.E2E_FRONTEND_PORT ?? '5180'}`;

test.beforeAll(async ({ request }) => {
  const response = await request.get(api.replace(/\/api\/v1$/, '') + '/health/ready');
  expect(response.ok(), 'The isolated E2E backend and MySQL must be ready').toBeTruthy();
});

test('public catalog and filters use the real API without exposing a token', async ({ page }) => {
  const catalog = page.waitForResponse((response) => response.url().startsWith(`${api}/propiedades?`));
  await page.goto('/');
  expect((await catalog).status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Catálogo general' })).toBeVisible();

  await page.getByRole('button', { name: 'Abrir filtros' }).click();
  await page.getByRole('combobox', { name: 'Rango de precio' }).selectOption('under-1m');
  const search = page.waitForRequest((request) => request.url().startsWith(`${api}/busquedas`));
  const searchResponse = page.waitForResponse((response) => response.url().startsWith(`${api}/busquedas`));
  await page.getByRole('button', { name: 'Buscar propiedades' }).click();
  const request = await search;
  expect(request.method()).toBe('POST');
  expect(request.postDataJSON()).toMatchObject({ precio_max: '1000000' });
  expect(request.headers().authorization).toBeUndefined();
  const response = await searchResponse;
  expect(response.status()).toBe(200);
  const result = await response.json() as { items: Record<string, unknown>[] };
  for (const item of result.items) {
    expect(item).not.toHaveProperty('direccion');
    expect(item).not.toHaveProperty('latitud');
    expect(item).not.toHaveProperty('longitud');
    expect(Number(item.precio)).toBeLessThanOrEqual(1_000_000);
  }
});

test('confirmed synthetic user logs in and opens protected chat without persisting JWT', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill('e2e-general@example.invalid');
  await page.getByPlaceholder('Contraseña ...').fill('E2eTesting1!');
  const login = page.waitForResponse((response) => response.url() === `${api}/sesiones`);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  expect((await login).status()).toBe(200);
  await expect(page).toHaveURL(base + '/');
  const storage = await page.evaluate(() => ({
    local: JSON.stringify(localStorage), session: JSON.stringify(sessionStorage),
  }));
  expect(storage.local).not.toContain('eyJ');
  expect(storage.session).not.toContain('eyJ');
  const sentFrames: string[] = [];
  const receivedTypes: string[] = [];
  const socketUrls: string[] = [];
  page.on('websocket', (socket) => {
    if (!socket.url().endsWith('/api/v1/ws/chat')) return;
    socketUrls.push(socket.url());
    socket.on('framesent', (frame) => sentFrames.push(String(frame.payload)));
    socket.on('framereceived', (frame) => {
      const parsed = JSON.parse(String(frame.payload)) as { type: string };
      receivedTypes.push(parsed.type);
    });
  });
  await page.getByRole('button', { name: 'Mensajes' }).first().click();
  await expect.poll(() => socketUrls.length).toBeGreaterThan(0);
  expect(socketUrls.every((url) => new URL(url).search === '')).toBe(true);
  await expect.poll(() => sentFrames.length).toBeGreaterThan(0);
  expect((JSON.parse(sentFrames[0]) as { type: string }).type).toBe('auth');
  await expect.poll(() => receivedTypes.includes('auth.ok')).toBe(true);
  await expect(page.getByRole('heading', { name: 'Chats', exact: true })).toBeVisible();
  const inbox = await page.request.get(`${api}/conversaciones`, { headers: { Authorization: `Bearer ${(await (await page.request.post(`${api}/sesiones`, { data: { correo: 'e2e-general@example.invalid', password: 'E2eTesting1!' } })).json()).access_token}` } });
  expect(inbox.status()).toBe(200);
});

test('public registration reaches the API and asks for email confirmation', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Regístrate aquí' }).click();
  await page.getByRole('button', { name: /Prospecto/ }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByPlaceholder('Nombre completo').fill('Cliente E2E');
  await page.getByPlaceholder('Correo electrónico').fill(`e2e-${Date.now()}@example.invalid`);
  await page.getByPlaceholder('Contraseña', { exact: true }).fill('E2eTesting1!');
  await page.getByPlaceholder('Confirmar').fill('E2eTesting1!');
  const registration = page.waitForResponse((response) => response.url() === `${api}/cuentas`);
  await page.getByRole('button', { name: 'Registrarme' }).click();
  expect((await registration).status()).toBe(201);
  await expect(page.getByText('Cuenta registrada. Confirma tu correo antes de iniciar sesión.')).toBeVisible();
});

test('protected route redirects to login and invalid credentials show a safe error', async ({ page }) => {
  await page.goto('/messages');
  await expect(page).toHaveURL(base + '/login');
  await page.getByPlaceholder('Correo electrónico').fill('nobody@example.invalid');
  await page.getByPlaceholder('Contraseña ...').fill('Incorrect1!');
  const login = page.waitForResponse((response) => response.url() === `${api}/sesiones`);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  expect((await login).status()).toBe(401);
  await expect(page.getByRole('alert')).toContainText('No pudimos iniciar sesión');
});

test('natural language search reaches chatbot and remains private', async ({ page }) => {
  await page.goto('/');
  const input = page.getByPlaceholder('Buscar propiedades...').last();
  await input.fill('Quiero rentar una casa en Monterrey');
  const response = page.waitForResponse((item) => item.url() === `${api}/chatbot/consultas`);
  await input.press('Enter');
  const result = await response;
  expect(result.status()).toBe(200);
  const body = await result.json() as { estado: string; resultados: Record<string, unknown>[] };
  expect(body.estado).toBe('ACLARACION');
  expect(body.resultados).toEqual([]);
});

test('advisor dashboard loads own portfolio and notifications through the API', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill('phase4-advisor@example.com');
  await page.getByPlaceholder('Contraseña ...').fill('Secure1!');
  const portfolio = page.waitForResponse((response) =>
    response.url().startsWith(`${api}/me/estadisticas?`));
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).toHaveURL(base + '/asesor');
  expect((await portfolio).status()).toBe(200);
  await expect(page.getByRole('button', { name: 'Portafolio', exact: true })).toBeVisible();
});

test('admin dashboard loads privileged accounts and reports', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill('e2e-admin@example.invalid');
  await page.getByPlaceholder('Contraseña ...').fill('E2eTesting1!');
  const accounts = page.waitForResponse((response) =>
    response.url().startsWith(`${api}/admin/estadisticas?`));
  const reports = page.waitForResponse((response) =>
    response.url().startsWith(`${api}/admin/reportes?`));
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).toHaveURL(base + '/admin');
  expect((await accounts).status()).toBe(200);
  expect((await reports).status()).toBe(200);
  await expect(page.getByText('Panel de Control Global', { exact: true })).toBeVisible();
});

test('general account cannot read administration and revoked JWT stops working', async ({ request }) => {
  const session = await request.post(`${api}/sesiones`, {
    data: { correo: 'e2e-general@example.invalid', password: 'E2eTesting1!' },
  });
  expect(session.status()).toBe(200);
  const body = await session.json() as { access_token: string };
  const headers = { Authorization: `Bearer ${body.access_token}` };
  expect((await request.get(`${api}/admin/cuentas`, { headers })).status()).toBe(403);
  expect((await request.get(`${api}/me`, { headers })).status()).toBe(200);
  expect((await request.delete(`${api}/sesiones/actual`, { headers })).status()).toBe(204);
  expect((await request.get(`${api}/me`, { headers })).status()).toBe(401);
});
