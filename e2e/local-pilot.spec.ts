import { expect, test } from '@playwright/test';

const api = 'http://127.0.0.1:8001/api/v1';

test.beforeAll(async ({ request }) => {
  const response = await request.get('http://127.0.0.1:8001/health/ready');
  expect(response.ok(), 'The isolated local pilot must be ready').toBeTruthy();
});

for (const accountType of ['Prospecto', 'Asesor Inmobiliario'] as const) {
  test(`${accountType} registers and logs in without email confirmation`, async ({ page }) => {
    const email = `pilot-${accountType === 'Prospecto' ? 'general' : 'advisor'}-${crypto.randomUUID()}@example.invalid`;
    await page.goto('/login');
    await expect(page.getByText('Piloto local sin correo:')).toBeVisible();
    await expect(page.getByRole('button', { name: '¿Olvidaste tu contraseña?' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Regístrate aquí' }).click();
    await page.getByRole('button', { name: accountType, exact: false }).click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.getByPlaceholder('Nombre completo').fill(`Piloto ${accountType}`);
    await page.getByPlaceholder('Correo electrónico').fill(email);
    if (accountType === 'Asesor Inmobiliario') {
      await page.getByPlaceholder('Nombre comercial').fill('Asesor Piloto');
      await page.getByPlaceholder('Teléfono profesional').fill('4771234567');
    }
    await page.getByPlaceholder('Contraseña', { exact: true }).fill('E2eTesting1!');
    await page.getByPlaceholder('Confirmar').fill('E2eTesting1!');
    const registration = page.waitForResponse((response) =>
      response.url() === `${api}/${accountType === 'Prospecto' ? 'cuentas' : 'asesores'}`);
    await page.getByRole('button', { name: 'Registrarme' }).click();
    expect((await registration).status()).toBe(201);
    await expect(page.getByText('Cuenta de piloto registrada. Puedes iniciar sesión ahora; el correo no está verificado.')).toBeVisible();
    await page.getByRole('button', { name: 'Ir al login' }).click();
    await page.getByPlaceholder('Correo electrónico').fill(email);
    await page.getByPlaceholder('Contraseña ...').fill('E2eTesting1!');
    const login = page.waitForResponse((response) => response.url() === `${api}/sesiones`);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    expect((await login).status()).toBe(200);
    await expect(page).toHaveURL(accountType === 'Prospecto' ? '/' : '/asesor');
  });
}

test('local superadministrator can sign in and read the administration dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill('e2e-admin@example.invalid');
  await page.getByPlaceholder('Contraseña ...').fill('E2eTesting1!');
  const accounts = page.waitForResponse((response) =>
    response.url().startsWith(`${api}/admin/cuentas?`));
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).toHaveURL('/admin');
  expect((await accounts).status()).toBe(200);
  await page.getByRole('button', { name: 'Solicitudes' }).click();
  await expect(page).toHaveURL('/admin/solicitudes');
  await page.getByRole('button', { name: 'Publicaciones' }).click();
  await expect(page).toHaveURL('/admin/propiedades');
  await expect(page.getByRole('heading', { name: 'Publicaciones' })).toBeVisible();
  await page.getByRole('button', { name: 'Reportes' }).click();
  await expect(page).toHaveURL('/admin/reportes');
});

test('synthetic advisor sees a precise validation blocker and usable routes', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill('e2e-advisor@example.invalid');
  await page.getByPlaceholder('Contraseña ...').fill('E2eTesting1!');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).toHaveURL('/asesor');
  await page.getByRole('button', { name: 'Validación' }).click();
  await expect(page).toHaveURL('/asesor/validacion');
  await expect(page.getByText('No encontramos un expediente de asesor para esta cuenta.')).toBeVisible();
  await page.getByRole('button', { name: 'Propiedades' }).click();
  await expect(page).toHaveURL('/asesor/propiedades');
  await expect(page.getByRole('status')).toContainText('Sin expediente');
  await expect(page.getByRole('button', { name: 'Nueva propiedad' })).toBeDisabled();
});
