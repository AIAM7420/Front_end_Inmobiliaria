import { expect, test } from '@playwright/test';

const sizes = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 },
];
const roles = [
  { name: 'general', email: 'e2e-general@example.invalid', home: '/', routes: ['/', '/map', '/favorites', '/messages', '/profile', '/profile?view=general', '/profile?view=support'] },
  { name: 'advisor', email: 'phase4-advisor@example.com', home: '/asesor', routes: ['/asesor', '/inmuebles', '/map', '/asesor/propiedades', '/asesor/mensajes', '/asesor/profile', '/asesor/profile?view=documents', '/asesor/profile?view=plan', '/asesor/profile?view=general', '/asesor/profile?view=support'] },
  { name: 'admin', email: 'e2e-admin@example.invalid', home: '/admin', routes: ['/admin', '/inmuebles', '/map', '/admin/asesores', '/admin/solicitudes', '/admin/moderacion', '/admin/finanzas', '/admin/reportes', '/admin/profile', '/admin/profile?view=configuration', '/admin/profile?view=diagnostics', '/admin/profile?view=audit', '/admin/profile?view=backups', '/admin/profile?view=support'] },
];

for (const size of sizes) for (const dark of [false, true]) for (const role of roles) {
  test(`${role.name} screens ${size.name} ${dark ? 'dark' : 'light'}`, async ({ page }) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light' });
    const api = process.env.E2E_API_URL ?? 'http://127.0.0.1:8000/api/v1';
    const session = await page.request.post(`${api}/sesiones`, { data: { correo: role.email, password: role.name === 'advisor' ? 'Secure1!' : 'E2eTesting1!' } });
    const headers = { Authorization: `Bearer ${(await session.json()).access_token}` };
    const preferences = await (await page.request.get(`${api}/me/preferencias`, { headers })).json();
    const saved = await page.request.put(`${api}/me/preferencias`, { headers: { ...headers, 'If-Match': `"v${preferences.version}"` }, data: { tema: dark ? 'OSCURO' : 'CLARO', alertas_correo: preferences.alertas_correo } });
    expect(saved.ok()).toBeTruthy();
    await page.addInitScript(theme => localStorage.setItem('inmo_theme', theme), dark ? 'dark' : 'light');
    await page.goto('/login');
    await page.getByPlaceholder('Correo electrónico').fill(role.email);
    await page.getByPlaceholder('Contraseña ...').fill(role.name === 'advisor' ? 'Secure1!' : 'E2eTesting1!');
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
    await page.waitForURL(role.home);
    await expect(page.locator('html')).toHaveClass(dark ? /dark/ : /^(?!.*dark).*$/);
    for (const route of role.routes) {
      // Preserve the in-memory JWT; exercise the same history event as browser navigation.
      await page.evaluate(path => { history.pushState({}, '', path); dispatchEvent(new PopStateEvent('popstate')); }, route);
      if (route === '/map') await expect(page.getByText('El mapa no está configurado. Puedes consultar las propiedades en la lista.', { exact: true })).toBeVisible();
      else await expect(page.getByRole('heading').filter({ visible: true }).first()).toBeVisible();
      await page.waitForFunction(() => !document.querySelector('[aria-busy=true]'));
      await page.evaluate(async () => { await document.fonts.ready; });
      await expect(page.getByText('Cargando cuenta…', { exact: true }).filter({ visible: true })).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
      await page.screenshot({ path: `docs/evidence/fidelity/current/${role.name}-${size.name}-${dark ? 'dark' : 'light'}-${route.replace(/[^a-z0-9]/gi, '_') || 'home'}.png`, fullPage: true, animations: 'disabled' });
    }
    expect(errors).toEqual([]);
  });
}

test('professional navigation exposes catalog and map; administrative overflow remains usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill('e2e-admin@example.invalid');
  await page.getByPlaceholder('Contraseña ...').fill('E2eTesting1!');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await page.waitForURL('/admin');
  const nav = page.getByRole('navigation', { name: 'Navegación principal móvil' });
  await nav.getByRole('button', { name: 'Inmuebles', exact: true }).click();
  await page.waitForURL('/inmuebles');
  await nav.getByRole('button', { name: 'Mapa', exact: true }).click();
  await page.waitForURL('/map');
  await nav.getByRole('button', { name: 'Más opciones administrativas' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Autorizaciones', exact: true }).click();
  await page.waitForURL('/admin/solicitudes');
  await expect(page.getByRole('heading', { name: 'Autorizaciones de asesores', exact: true })).toBeVisible();
  await page.evaluate(() => { history.pushState({}, '', '/messages'); dispatchEvent(new PopStateEvent('popstate')); });
  await page.waitForURL('/');
  await expect(page.getByRole('heading', { name: 'Catálogo general' })).toBeVisible();
});
