import { expect, test, type Page, type APIRequestContext } from '@playwright/test';
import { createHash } from 'node:crypto';

const api = process.env.E2E_API_URL ?? 'http://127.0.0.1:8000/api/v1';
const backend = api.replace(/\/api\/v1$/, '');
let fixture: { id: string; asesor_id: string; titulo: string };
test.beforeAll(async ({ browser, request }) => {
  const headers = await authenticate(request, 'phase4-advisor@example.com', 'Secure1!');
  const [types, zones, operations] = await Promise.all(['tipos', 'zonas', 'operaciones'].map(async name => (await request.get(`${api}/catalogos/${name}`)).json()));
  const created = await request.post(`${api}/propiedades`, { headers, data: { tipo_id: types.find((item: { codigo: string }) => item.codigo === 'CASA').id, zona_id: zones.find((item: { nombre: string }) => item.nombre === 'León (zona general)').id, operacion_id: operations.find((item: { codigo: string }) => item.codigo === 'VENTA').id, titulo: `Casa integrada navegador ${Date.now()}`, descripcion: 'Publicación sintética para probar favoritos y contacto real.', direccion: 'Calle de prueba 123', codigo_postal: '37000', latitud: '21.14', longitud: '-101.67', precio: '1000000', moneda: 'MXN', habitaciones: 2, banos: '1', superficie_construccion: '90', superficie_terreno: '120' } });
  expect(created.status()).toBe(201); fixture = await created.json();
  const page = await browser.newPage();
  const jpeg = await page.evaluate(() => { const canvas = document.createElement('canvas'); canvas.width = 320; canvas.height = 200; const context = canvas.getContext('2d')!; context.fillStyle = '#FA003F'; context.fillRect(0, 0, 320, 200); return canvas.toDataURL('image/jpeg').split(',')[1]; });
  await page.close();
  const content = Buffer.from(jpeg, 'base64');
  const receipt = await (await request.post(`${api}/me/propiedades/${fixture.id}/fotografias`, { headers, data: { nombre: 'casa.jpg', mime: 'image/jpeg', tamano_bytes: content.length, sha256: createHash('sha256').update(content).digest('hex') } })).json();
  const key = new URL(receipt.url).pathname.replace(/^\/upload\//, '');
  expect((await request.put(`${backend}/__e2e/storage/${key}`, { data: content, headers: { 'Content-Type': 'image/jpeg' } })).status()).toBe(204);
  expect((await request.post(`${api}/me/propiedades/${fixture.id}/fotografias/confirmaciones`, { headers, data: { comprobante: receipt.comprobante } })).status()).toBe(201);
  const current = await request.get(`${api}/me/propiedades/${fixture.id}`, { headers });
  const publication = await request.post(`${api}/me/propiedades/${fixture.id}/publicacion`, { headers: { ...headers, 'If-Match': current.headers().etag }, data: { accion: 'PUBLICAR', visible: true } });
  expect(publication.status(), await publication.text()).toBe(200);
});
test.afterAll(async ({ request }) => {
  if (!fixture) return;
  const headers = await authenticate(request, 'phase4-advisor@example.com', 'Secure1!');
  const current = await request.get(`${api}/me/propiedades/${fixture.id}`, { headers });
  expect((await request.post(`${api}/me/propiedades/${fixture.id}/publicacion`, { headers: { ...headers, 'If-Match': current.headers().etag }, data: { accion: 'ARCHIVAR' } })).status()).toBe(200);
});
async function authenticate(request: APIRequestContext, email: string, password: string) {
  const session = await request.post(`${api}/sesiones`, { data: { correo: email, password } });
  expect(session.status()).toBe(200);
  return { Authorization: `Bearer ${(await session.json()).access_token}` };
}
async function login(page: Page, email: string, password: string, home: string) {
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill(email);
  await page.getByPlaceholder('Contraseña ...').fill(password);
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await page.waitForURL(home);
}
async function navigate(page: Page, path: string) {
  await page.evaluate(path => { history.pushState({}, '', path); dispatchEvent(new PopStateEvent('popstate')); }, path);
}
async function transport(page: Page, request: APIRequestContext) {
  await page.route('https://objects.test/**', async route => {
    const outgoing = route.request();
    expect(outgoing.headers().authorization).toBeUndefined();
    const key = new URL(outgoing.url()).pathname.replace(/^\/(upload|read)\//, '');
    const result = outgoing.method() === 'PUT'
      ? await request.put(`${backend}/__e2e/storage/${key}`, { data: outgoing.postDataBuffer()!, headers: { 'Content-Type': outgoing.headers()['content-type'] } })
      : await request.get(`${backend}/__e2e/storage/${key}`);
    await route.fulfill({ response: result });
  });
}

test('two real participants exchange private attachments, names, reading and personal archive', async ({ page, browser, request }) => {
  test.setTimeout(90_000);
  const advisor = await authenticate(request, 'phase4-advisor@example.com', 'Secure1!');
  const professional = await (await request.get(`${api}/asesores/me`, { headers: advisor })).json();
  const advisorAccount = await (await request.get(`${api}/me`, { headers: advisor })).json();
  const customer = await authenticate(request, 'e2e-general@example.invalid', 'E2eTesting1!');
  const property = fixture;
  expect(property.asesor_id).toBe(professional.id);
  expect(property, 'The isolated professional fixture has a public property').toBeTruthy();
  const second = await browser.newContext({ baseURL: `http://127.0.0.1:${process.env.E2E_FRONTEND_PORT ?? '5180'}` });
  const advisorPage = await second.newPage();
  try {
    await page.addInitScript(() => { const sockets: WebSocket[] = []; Object.defineProperty(window, '__inmoSockets', { value: sockets }); const Native = WebSocket; window.WebSocket = class extends Native { constructor(url: string | URL, protocols?: string | string[]) { super(url, protocols); sockets.push(this); } }; });
    await transport(page, request); await transport(advisorPage, request);
    await login(page, 'e2e-general@example.invalid', 'E2eTesting1!', '/');
    await login(advisorPage, 'phase4-advisor@example.com', 'Secure1!', '/asesor');
    await navigate(page, '/inmuebles');
    await page.getByText(property.titulo, { exact: true }).last().click();
    const contacting = page.waitForResponse(response => response.request().method() === 'POST' && response.url().endsWith('/conversaciones'));
    await page.getByRole('button', { name: 'Contactar', exact: true }).click();
    const conversationResponse = await contacting;
    expect(conversationResponse.status()).toBe(201);
    const conversation = await conversationResponse.json();
    await page.waitForURL(`/messages?conversation=${conversation.id}`);
    await navigate(advisorPage, `/asesor/mensajes?conversation=${conversation.id}`);
    await expect(page.getByRole('heading', { name: 'Asesor Fase Cuatro', exact: true, level: 2 })).toBeVisible();
    await expect(advisorPage.getByRole('heading', { name: 'Usuario E2E', exact: true, level: 2 })).toBeVisible();
    const content = `Mensaje real navegador ${Date.now()}`;
    await page.getByRole('textbox', { name: 'Escribe un mensaje' }).fill(content);
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(advisorPage.getByText(content, { exact: true })).toBeVisible();
    await expect.poll(async () => (await (await request.get(`${api}/conversaciones/${conversation.id}`, { headers: customer })).json()).participantes.find((item: { id: string }) => item.id === advisorAccount.id)?.ultima_leida ?? '0').not.toBe('0');
    await page.getByRole('button', { name: 'Adjuntar archivo' }).click();
    await page.locator('input[type=file]').setInputFiles({ name: 'documento-privado.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF') });
    await expect(page.getByRole('button', { name: 'Quitar documento-privado.pdf' })).toBeVisible();
    const sent = page.waitForResponse(response => response.request().method() === 'POST' && response.url().endsWith(`/conversaciones/${conversation.id}/mensajes`));
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    const attachment = (await (await sent).json()).adjuntos[0];
    await expect(advisorPage.getByRole('link', { name: 'documento-privado.pdf', exact: true })).toBeVisible();
    const admin = await authenticate(request, 'e2e-admin@example.invalid', 'E2eTesting1!');
    expect((await request.get(`${api}/archivos/${attachment.id}/url`, { headers: admin })).status()).toBe(404);
    const chat = page.getByRole('region', { name: 'Conversación activa' });
    await chat.getByRole('button', { name: 'Archivar conversación' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Archivar', exact: true }).click();
    await expect(chat.getByRole('button', { name: 'Recuperar conversación' })).toBeVisible();
    expect((await (await request.get(`${api}/conversaciones/${conversation.id}`, { headers: advisor })).json()).archivada).toBe(false);
    await chat.getByRole('button', { name: 'Recuperar conversación' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Recuperar', exact: true }).click();
    await expect(chat.getByRole('button', { name: 'Archivar conversación' })).toBeVisible();
    // A stale archive must retain the draft and require review, never replay the mutation.
    const draft = 'Borrador que debe conservarse después del conflicto';
    await page.getByRole('textbox', { name: 'Escribe un mensaje' }).fill(draft);
    let staleAttempts = 0;
    await page.route(`**/conversaciones/${conversation.id}/estado`, async route => {
      staleAttempts++;
      await route.fulfill({ status: 412, contentType: 'application/problem+json', body: JSON.stringify({ status: 412, title: 'Versión desactualizada', code: 'VERSION_DESACTUALIZADA' }) });
    });
    await chat.getByRole('button', { name: 'Archivar conversación' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Archivar', exact: true }).click();
    await chat.getByRole('button', { name: 'Revisar versión actual', exact: true }).click();
    await chat.getByRole('button', { name: 'He revisado; conservar mis cambios', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Escribe un mensaje' })).toHaveValue(draft);
    expect(staleAttempts).toBe(1);
    await page.unroute(`**/conversaciones/${conversation.id}/estado`);
    const recovery = page.waitForResponse(response => response.url().includes(`/conversaciones/${conversation.id}/mensajes?`) && response.url().includes('after_sequence='));
    await page.evaluate(() => { (window as unknown as { __inmoSockets: WebSocket[] }).__inmoSockets.at(-1)?.close(); });
    const missed = `Recuperación REST ${Date.now()}`;
    expect((await request.post(`${api}/conversaciones/${conversation.id}/mensajes`, { headers: advisor, data: { cliente_mensaje_id: crypto.randomUUID(), contenido: missed } })).status()).toBe(201);
    expect((await recovery).status()).toBe(200);
    await expect(page.getByLabel('Historial de mensajes').getByText(missed, { exact: true })).toHaveCount(1);
    await advisorPage.screenshot({ path: 'docs/evidence/chat-private-real.png', fullPage: true });
  } finally { await second.close(); }
});

test('favorites persist across login and support retains named administrative replies', async ({ page, request }) => {
  const customer = await authenticate(request, 'e2e-general@example.invalid', 'E2eTesting1!');
  const property = fixture;
  expect(property).toBeTruthy();
  expect((await request.put(`${api}/me/favoritos/${property.id}`, { headers: customer })).ok()).toBeTruthy();
  await transport(page, request);
  await login(page, 'e2e-general@example.invalid', 'E2eTesting1!', '/');
  await navigate(page, '/favorites');
  await expect(page.getByText(property.titulo, { exact: true }).first()).toBeVisible();
  const removing = page.waitForResponse(response => response.request().method() === 'DELETE' && response.url().endsWith(`/me/favoritos/${property.id}`));
  await page.getByRole('button', { name: 'Quitar de favoritos', exact: true }).first().click();
  expect((await removing).ok()).toBeTruthy();
  await navigate(page, '/profile?view=support');
  const subject = `Soporte navegador ${Date.now()}`;
  await page.getByRole('textbox', { name: 'Asunto', exact: true }).fill(subject);
  await page.getByRole('textbox', { name: 'Describe la solicitud' }).fill('Consulta sintética sobre el inventario');
  const created = page.waitForResponse(response => response.request().method() === 'POST' && response.url().endsWith('/me/soporte'));
  await page.getByRole('button', { name: 'Enviar solicitud', exact: true }).click();
  const ticket = await (await created).json();
  const admin = await authenticate(request, 'e2e-admin@example.invalid', 'E2eTesting1!');
  const reply = await request.post(`${api}/admin/soporte/${ticket.id}/respuestas`, { headers: { ...admin, 'If-Match': `"v${ticket.version}"` }, data: { mensaje_id: crypto.randomUUID(), contenido: 'Respuesta administrativa persistida', estado: 'EN_ATENCION' } });
  expect(reply.status()).toBe(200);
  await page.getByRole('button', { name: 'Volver a solicitudes' }).click();
  await page.getByRole('button', { name: new RegExp(subject) }).click();
  await expect(page.getByText('Respuesta administrativa persistida', { exact: true })).toBeVisible();
  await expect(page.getByText('Admin E2E · Administración', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/evidence/support-real.png', fullPage: true });
});

test('administrative filtered CSV downloads and private backup job is persisted', async ({ page }) => {
  await login(page, 'e2e-admin@example.invalid', 'E2eTesting1!', '/admin');
  await navigate(page, '/admin/asesores');
  await page.getByPlaceholder('Buscar por nombre...').filter({ visible: true }).fill('Usuario E2E');
  const csv = page.waitForResponse(response => response.url().includes('/admin/exportaciones/usuarios.csv'));
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar resultados CSV' }).click();
  const exported = await csv;
  expect(exported.status()).toBe(200);
  expect(new URL(exported.url()).searchParams.get('texto')).toBe('Usuario E2E');
  expect((await download).suggestedFilename()).toBe('inmo-usuarios.csv');
  await navigate(page, '/admin/profile?view=backups');
  await page.getByRole('textbox', { name: 'Contraseña para respaldos' }).fill('E2eTesting1!');
  const job = page.waitForResponse(response => response.request().method() === 'POST' && response.url().endsWith('/admin/respaldos'));
  await page.getByRole('button', { name: 'Crear respaldo', exact: true }).click();
  expect((await job).status()).toBe(202);
  await expect(page.getByText('Trabajo de respaldo registrado.', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/evidence/backup-job-real.png', fullPage: true });
});
