import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const api = process.env.E2E_API_URL ?? 'http://127.0.0.1:8000/api/v1';
const backend = api.replace(/\/api\/v1$/, '');
const password = 'AltaTesting1!';
const pdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF');
async function authenticate(request: APIRequestContext, correo: string, secret = password) {
  const response = await request.post(`${api}/sesiones`, { data: { correo, password: secret } });
  expect(response.status(), await response.text()).toBe(200);
  return { Authorization: `Bearer ${(await response.json()).access_token}` };
}
async function login(page: Page, correo: string, secret = password, home = '/registro-asesor') {
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill(correo);
  await page.getByPlaceholder('Contraseña ...').fill(secret);
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await page.waitForURL(home);
}
async function navigate(page: Page, path: string) {
  await page.evaluate(path => { history.pushState({}, '', path); dispatchEvent(new PopStateEvent('popstate')); }, path);
}
async function storageTransport(page: Page, request: APIRequestContext) {
  await page.route('https://objects.test/**', async route => {
    const outgoing = route.request();
    expect(outgoing.headers().authorization).toBeUndefined();
    const key = new URL(outgoing.url()).pathname.replace(/^\/(upload|read)\//, '');
    const response = await request.put(`${backend}/__e2e/storage/${key}`, { data: outgoing.postDataBuffer()!, headers: { 'Content-Type': outgoing.headers()['content-type'] } });
    await route.fulfill({ response });
  });
}
for (const appearance of [{ name: 'desktop-light', width: 1440, height: 960, dark: false }, { name: 'mobile-dark', width: 390, height: 844, dark: true }]) {
  test(`new advisor completes real registration, verification and confirmed payment: ${appearance.name}`, async ({ page, browser, request }) => {
    test.setTimeout(120_000);
    await page.setViewportSize(appearance);
    await page.addInitScript(dark => localStorage.setItem('inmo_theme', dark ? 'dark' : 'light'), appearance.dark);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const correo = `alta-${appearance.name}-${Date.now()}@example.invalid`;
    await storageTransport(page, request);
    await page.goto('/login');
    await page.getByRole('button', { name: 'Regístrate aquí' }).click();
    await page.getByRole('button', { name: /Asesor Inmobiliario/ }).click();
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
    await page.getByPlaceholder('Nombre completo').fill('Asesor Alta Navegador');
    await page.getByPlaceholder('Correo electrónico').fill(correo);
    await page.getByPlaceholder('Contraseña', { exact: true }).fill(password);
    await page.getByPlaceholder('Confirmar', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Comenzar', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Completa tu perfil profesional' })).toBeVisible();
    await page.getByPlaceholder('Nombre comercial').fill('Alta INMO navegador');
    await page.getByPlaceholder('Teléfono profesional').fill('4771234567');
    await page.getByPlaceholder('Biografía profesional').fill('Perfil sintético para comprobar el alta integrada.');
    const registered = page.waitForResponse(response => response.request().method() === 'POST' && response.url().endsWith('/asesores'));
    await page.getByRole('button', { name: 'Crear cuenta y verificar correo' }).click();
    expect((await registered).status()).toBe(201);
    await expect(page.getByText('Cuenta registrada. Confirma tu correo antes de iniciar sesión.', { exact: false })).toBeVisible();
    expect((await request.post(`${api}/sesiones`, { data: { correo, password } })).status()).toBe(401);
    const confirmation = await request.get(`${backend}/__e2e/correo`, { params: { correo } });
    expect(confirmation.status()).toBe(200);
    await page.goto(`/confirmar-correo?token=${encodeURIComponent((await confirmation.json()).token)}`);
    await page.getByRole('button', { name: 'Confirmar correo', exact: true }).click();
    await expect(page.getByText('Correo confirmado. Ya puedes iniciar sesión.')).toBeVisible();
    if (appearance.dark) {
      const preferencesHeaders = await authenticate(request, correo);
      const preferences = await (await request.get(`${api}/me/preferencias`, { headers: preferencesHeaders })).json();
      expect((await request.put(`${api}/me/preferencias`, { headers: { ...preferencesHeaders, 'If-Match': `"v${preferences.version}"` }, data: { tema: 'OSCURO', alertas_correo: false } })).status()).toBe(200);
    }
    await login(page, correo);
    await expect(page.getByRole('button', { name: 'Guardar y subir documentos' })).toBeVisible();
    await page.getByLabel('Nombre comercial', { exact: true }).fill('Alta INMO verificada');
    await page.getByRole('button', { name: 'Guardar y subir documentos' }).click();
    const submit = page.getByRole('button', { name: 'Consultar revisión', exact: true });
    await expect(submit).toBeDisabled();
    const fileChooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Subir Identificación oficial (INE / Pasaporte)', exact: true }).press('Enter');
    await (await fileChooser).setFiles({ name: 'identificacion.pdf', mimeType: 'application/pdf', buffer: pdf });
    await expect(page.getByRole('button', { name: 'Enviar documentos para revisión' })).toBeDisabled();
    await page.locator('input[type=file][aria-label="Subir Constancia de situación fiscal"]').setInputFiles({ name: 'constancia-fiscal.pdf', mimeType: 'application/pdf', buffer: pdf });
    await expect(page.getByRole('button', { name: 'Enviar documentos para revisión' })).toBeEnabled();
    await expect(page.locator('html')).toHaveClass(appearance.dark ? /dark/ : /^(?!.*dark)/);
    await page.screenshot({ path: `docs/evidence/alta-asesor-${appearance.name}-documentos.png`, fullPage: true });
    await page.getByRole('button', { name: 'Enviar documentos para revisión' }).click();
    await expect(page.getByRole('heading', { name: 'Tu cuenta está en revisión' })).toBeVisible();
    await page.screenshot({ path: `docs/evidence/alta-asesor-${appearance.name}-revision.png`, fullPage: true });
    const headers = await authenticate(request, correo);
    const application = await (await request.get(`${api}/asesores/me/solicitud`, { headers })).json();
    expect(application.documentos.map((item: { tipo: string }) => item.tipo).sort()).toEqual(['CONSTANCIA_SITUACION_FISCAL', 'IDENTIFICACION_OFICIAL']);
    expect(application.estado).toBe('PENDIENTE');
    for (const path of ['/asesor', '/asesor/propiedades', '/inmuebles']) {
      await navigate(page, path);
      await page.waitForURL('/registro-asesor');
      await expect(page.getByRole('heading', { name: 'Tu cuenta está en revisión' })).toBeVisible();
    }
    await page.getByRole('button', { name: 'Cerrar sesión y continuar después' }).click();
    await page.waitForURL('/login');
    await login(page, correo);
    await expect(page.getByRole('heading', { name: 'Tu cuenta está en revisión' })).toBeVisible();
    const context = await browser.newContext({ baseURL: `http://127.0.0.1:${process.env.E2E_FRONTEND_PORT ?? '5180'}` });
    try {
      const admin = await context.newPage();
      await login(admin, 'e2e-admin@example.invalid', 'E2eTesting1!', '/admin');
      await navigate(admin, `/admin/solicitudes?solicitud=${application.id}`);
      await expect(admin.getByText('identificacion.pdf', { exact: false })).toBeVisible();
      await expect(admin.getByText('constancia-fiscal.pdf', { exact: false })).toBeVisible();
      await admin.getByRole('button', { name: 'Aprobar', exact: true }).click();
      await admin.getByRole('button', { name: 'Confirmar decisión' }).click();
      await expect(admin.getByText('Decisión aplicada y auditada.')).toBeVisible();
    } finally { await context.close(); }
    await page.getByRole('button', { name: 'Actualizar estado' }).click();
    await expect(page.getByRole('heading', { name: 'Activa tu cuenta de Asesor' })).toBeVisible();
    await page.screenshot({ path: `docs/evidence/alta-asesor-${appearance.name}-planes.png`, fullPage: true });
    await page.getByRole('button', { name: 'Seleccionar plan', exact: true }).first().click();
    await page.route('https://checkout.stripe.test/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Proveedor de memoria de la base aislada</h1>' }));
    let checkout: { id: string } | undefined;
    // Read the real API receipt before Stripe navigation unloads its response body.
    await page.route(`${api}/me/pagos`, async route => {
      const response = await route.fetch();
      expect(response.status(), await response.text()).toBe(201);
      checkout = await response.json();
      await route.fulfill({ response });
    });
    const payment = page.waitForResponse(response => response.request().method() === 'POST' && response.url().endsWith('/me/pagos'));
    await page.getByRole('button', { name: 'Proceder al pago', exact: true }).click();
    const response = await payment;
    expect(response.status()).toBe(201);
    await page.waitForURL('https://checkout.stripe.test/**');
    await login(page, correo);
    await expect(page.getByRole('heading', { name: 'Activa tu cuenta de Asesor' })).toBeVisible();
    expect((await (await request.get(`${api}/me/suscripcion`, { headers })).json()).periodo).toBeNull();
    await navigate(page, '/pagos/exito');
    await expect(page.getByText('El regreso de Stripe no confirma el pago.', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Ver suscripción', exact: true }).click();
    await page.waitForURL('/registro-asesor');
    await expect(page.getByRole('heading', { name: 'Activa tu cuenta de Asesor' })).toBeVisible();
    const refreshedHeaders = await authenticate(request, correo);
    expect(checkout).toBeDefined();
    const confirmed = await request.post(`${backend}/__e2e/pagos/${checkout!.id}/confirmar`, { headers: refreshedHeaders });
    expect(confirmed.status(), await confirmed.text()).toBe(200);
    expect((await confirmed.json()).resultado).toBe('APLICADO');
    await page.getByRole('button', { name: 'Actualizar estado' }).click();
    await page.waitForURL('/asesor');
    await navigate(page, '/asesor/propiedades');
    await expect(page.getByRole('heading', { name: 'Mis Propiedades' })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('new advisor preserves profile edits on 412 and opens a new expediente after rejection', async ({ page, request }) => {
  test.setTimeout(90_000);
  const correo = `alta-rechazo-${Date.now()}@example.invalid`;
  expect((await request.post(`${api}/asesores`, { data: { cuenta: { nombre: 'Alta rechazada', correo, password }, nombre_comercial: 'Perfil original', telefono_profesional: '4771234567' } })).status()).toBe(201);
  const email = await (await request.get(`${backend}/__e2e/correo`, { params: { correo } })).json();
  expect((await request.post(`${api}/auth/correo/confirmar`, { data: { token: email.token } })).status()).toBe(200);
  const headers = await authenticate(request, correo);
  await login(page, correo);
  await expect(page.getByLabel('Nombre comercial', { exact: true })).toHaveValue('Perfil original');
  await page.getByLabel('Nombre comercial', { exact: true }).fill('Mi edición conservada');
  const current = await (await request.get(`${api}/asesores/me/perfil`, { headers })).json();
  expect((await request.patch(`${api}/asesores/me/perfil`, { headers: { ...headers, 'If-Match': `"v${current.version}"` }, data: { nombre_comercial: 'Cambio concurrente' } })).status()).toBe(200);
  let saves = 0;
  page.on('request', outgoing => { if (outgoing.method() === 'PATCH' && outgoing.url().endsWith('/asesores/me/perfil')) saves++; });
  await page.getByRole('button', { name: 'Guardar y subir documentos' }).click();
  await expect(page.getByRole('button', { name: 'Revisar versión actual' })).toBeVisible();
  expect(saves).toBe(1);
  await expect(page.getByLabel('Nombre comercial', { exact: true })).toHaveValue('Mi edición conservada');
  await page.getByRole('button', { name: 'Revisar versión actual' }).click();
  await page.getByRole('button', { name: 'He revisado; conservar mis cambios' }).click();
  expect(saves).toBe(1);
  await page.getByRole('button', { name: 'Guardar y subir documentos' }).click();
  await expect(page.getByRole('button', { name: 'Consultar revisión', exact: true })).toBeVisible();
  expect(saves).toBe(2);
  const application = await (await request.get(`${api}/asesores/me/solicitud`, { headers })).json();
  const admin = await authenticate(request, 'e2e-admin@example.invalid', 'E2eTesting1!');
  const decision = await request.post(`${api}/admin/solicitudes/${application.id}/decision`, { headers: { ...admin, 'If-Match': `"v${application.version}"` }, data: { decision: 'RECHAZAR', motivo: 'Falta evidencia fiscal legible' } });
  expect(decision.status(), await decision.text()).toBe(200);
  await page.getByRole('button', { name: 'Actualizar estado' }).click();
  await expect(page.getByRole('heading', { name: 'Revisa tu expediente' })).toBeVisible();
  await expect(page.getByText('Falta evidencia fiscal legible', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir nueva solicitud' }).click();
  await expect(page.locator('input[type=file][aria-label="Subir Constancia de situación fiscal"]')).toHaveCount(1);
  const resubmitted = await (await request.get(`${api}/asesores/me/solicitud`, { headers })).json();
  expect(resubmitted.id).not.toBe(application.id);
  expect(resubmitted.estado).toBe('PENDIENTE');
  expect(resubmitted.version).toBe(0);
  expect((await (await request.get(`${api}/admin/solicitudes/${application.id}`, { headers: admin })).json()).estado).toBe('RECHAZADA');
});
