import { expect, test } from '@playwright/test';

for (const mobile of [false, true]) {
  test(`real profile keeps its draft after a version conflict (${mobile ? 'mobile' : 'desktop'})`, async ({ page, request }) => {
    await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 });
    const api = process.env.E2E_API_URL ?? 'http://127.0.0.1:8000/api/v1';
    const browserErrors: string[] = [];
    page.on('pageerror', error => browserErrors.push(error.message));
    await page.goto('/login');
    await page.getByPlaceholder('Correo electrónico').fill('e2e-general@example.invalid');
    await page.getByPlaceholder('Contraseña ...').fill('E2eTesting1!');
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
    await page.waitForURL('/');
    await page.getByRole('button', { name: 'Abrir menú de usuario', exact: true }).click();
    await page.getByRole('button', { name: 'Ver perfil', exact: true }).click();
    await page.getByRole('button', { name: /Información personal/ }).click();
    const input = page.getByRole('textbox', { name: 'Nombre', exact: true });
    await expect(input).toBeVisible();
    const originalName = await input.inputValue();
    const login = await request.post(`${api}/sesiones`, { data: { correo: 'e2e-general@example.invalid', password: 'E2eTesting1!' } });
    const headers = { Authorization: `Bearer ${(await login.json()).access_token}` };
    const latest = await (await request.get(`${api}/me`, { headers })).json();
    const concurrent = await request.patch(`${api}/me`, { headers: { ...headers, 'If-Match': `"v${latest.version}"` }, data: { nombre: originalName } });
    expect(concurrent.ok()).toBeTruthy();
    await input.fill('Nombre pendiente de revisión');
    await page.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
    await expect(page.getByText('Los datos cambiaron mientras editabas.', { exact: false })).toBeVisible();
    await expect(input).toHaveValue('Nombre pendiente de revisión');
    await expect(page.getByRole('button', { name: 'Guardar cambios', exact: true })).toBeDisabled();
    expect(browserErrors).toEqual([]);
    // Discard this synthetic draft; no mutation is retried by the UI.
    if (mobile) await page.getByRole('dialog').press('Escape');
    else await page.getByRole('button', { name: 'Cerrar detalle', exact: true }).click();
    await page.getByRole('button', { name: 'General', exact: true }).click();
    await page.getByRole('button', { name: 'Usar modo oscuro', exact: true }).filter({ hasText: 'Usar modo oscuro' }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.screenshot({ path: `docs/evidence/fidelity/profile-${mobile ? 'mobile' : 'desktop'}-dark.png`, fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
