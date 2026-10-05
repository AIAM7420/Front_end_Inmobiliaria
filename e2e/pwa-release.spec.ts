import { expect, test, type Page, type APIRequestContext } from '@playwright/test';

const api = process.env.E2E_API_URL ?? 'http://127.0.0.1:8000/api/v1';
const backend = api.replace(/\/api\/v1$/, '');
const password = 'PwaTesting1!';
async function account(request: APIRequestContext) {
  const correo = `pwa-alta-${Date.now()}@example.invalid`;
  const result = await request.post(`${api}/asesores`, { data: { cuenta: { nombre: 'Asesor prueba PWA', correo, password }, nombre_comercial: 'INMO prueba de actualización', telefono_profesional: '4771234567' } });
  expect(result.status(), await result.text()).toBe(201);
  const email = await request.get(`${backend}/__e2e/correo`, { params: { correo } });
  expect(email.status()).toBe(200);
  expect((await request.post(`${api}/auth/correo/confirmar`, { data: { token: (await email.json()).token } })).status()).toBe(200);
  return correo;
}
async function login(page: Page, correo: string, path: string) {
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill(correo);
  await page.getByPlaceholder('Contraseña ...').fill(password);
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await page.waitForURL(path);
}
async function activate(page: Page) {
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
}
async function updateWorker(page: Page) {
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('Service worker did not activate')), 25_000);
      navigator.serviceWorker.addEventListener('controllerchange', () => { clearTimeout(timer); resolve(); }, { once: true });
      void registration.update().catch(error => { clearTimeout(timer); reject(error); });
    });
  });
}
async function assertStaticCache(page: Page) {
  // controllerchange fires before Workbox finishes its activation cleanup.
  await expect.poll(() => page.evaluate(async () => (await Promise.all((await caches.keys()).map(async key => (await (await caches.open(key)).keys()).some(item => new URL(item.url).pathname === '/index.html')))).some(Boolean)), { timeout: 15_000 }).toBe(false);
  const paths = await page.evaluate(async () => (await Promise.all((await caches.keys()).map(async key => (await (await caches.open(key)).keys()).map(item => new URL(item.url).pathname)))).flat());
  expect(paths.length).toBeGreaterThan(0);
  expect(paths).not.toContain('/index.html');
  expect(paths.some(path => path.includes('/api/') || path.includes('/__e2e/'))).toBe(false);
}

test('previous cached release reproduces the bypass; worker upgrade restores the real advisor gate', async ({ page, request }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await request.post('/__pwa/phase?value=previous');
  const correo = await account(request);
  await page.goto('/login');
  await activate(page);
  await login(page, correo, '/asesor');
  await expect(page.getByRole('button', { name: 'Mi inventario', exact: true })).toBeVisible();
  await request.post('/__pwa/phase?value=current');
  await updateWorker(page);
  await assertStaticCache(page);
  await page.reload();
  await login(page, correo, '/registro-asesor');
  await expect(page.getByLabel('Nombre comercial', { exact: true })).toBeVisible();
  for (const path of ['/asesor', '/asesor/profile?view=documents', '/asesor/suscripcion', '/map', '/inmuebles', '/admin']) {
    await page.evaluate(path => { history.pushState({}, '', path); dispatchEvent(new PopStateEvent('popstate')); }, path);
    await page.waitForURL('/registro-asesor');
    await expect(page.getByRole('button', { name: 'Guardar y subir documentos' })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Guardar y subir documentos' }).click();
  await expect(page.locator('input[type=file][aria-label="Subir Constancia de situación fiscal"]')).toHaveCount(1);
  await expect(page.getByText('La API no entregó una versión válida.', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Mi inventario', exact: true })).toHaveCount(0);
  await page.screenshot({ path: 'docs/evidence/alta-pwa-production-documentos.png', fullPage: true });
  await assertStaticCache(page);
  expect(errors).toEqual([]);
});

test('a production worker update prompts without reloading or losing the current form', async ({ page, request }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await request.post('/__pwa/phase?value=current');
  const correo = await account(request);
  await page.goto('/login');
  await activate(page);
  await login(page, correo, '/registro-asesor');
  const input = page.getByLabel('Nombre comercial', { exact: true });
  await input.fill('Mi formulario pendiente');
  await request.post('/__pwa/phase?value=updated');
  await updateWorker(page);
  await expect(page.getByRole('status', { name: 'Actualización de aplicación' })).toBeVisible();
  await expect(input).toHaveValue('Mi formulario pendiente');
  await expect(page.getByRole('button', { name: 'Guardar y subir documentos' })).toBeVisible();
  await page.screenshot({ path: 'docs/evidence/alta-pwa-production-actualizacion.png', fullPage: true });
  await page.getByRole('button', { name: 'Actualizar aplicación' }).click();
  await page.waitForURL('/login');
  await login(page, correo, '/registro-asesor');
  await expect(input).toHaveValue('INMO prueba de actualización');
  await assertStaticCache(page);
  expect(errors).toEqual([]);
});
